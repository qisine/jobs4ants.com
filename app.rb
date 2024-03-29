#encoding: utf-8

require 'yaml'
require 'json'
require 'pony'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'sinatra/json'
require 'active_record'
require 'sinatra/activerecord'
require './app/models/base_ad.rb'

also_reload './app/models/base_ad.rb' if development?
Dir["./app/models/*.rb"].each do |f|
  require f
  also_reload f if development?
end

ROOT_DOMAIN = production? ? "http://jobs4ants.com" : "http://0.0.0.0:9292"
EMAIL_CONFIG = File.join(File.dirname(__FILE__), "/config/email.yml")
EMAIL_TEMPLATE = File.join(File.dirname(__FILE__), "/app/email/confirmation_notification.%s.yml")

LOCALES = ["zh", "de", "en"]
DEFAULT_LOCALE = "zh"

set :views, Proc.new { File.join(root, "app", "views") }
enable :sessions
set :session_secret, "an94we8gha048hq92h8g3HOWSObuuoawuo"

get %r{/d/offered-ads/(\d+)/?} do |id|
  begin
    json(OfferedAd.where(published: true).find(id).to_h)
  rescue ActiveRecord::RecordNotFound
    status 404
    json(error: "record with #{id} not found")
  end
end

get '/d/offered-ads/?*?' do 
  params_ = parse_params(params)

  ads = OfferedAd.where(published: true)
  ads = ads.joins(:job_category).where(job_category_id: params_[:cats]) if params_[:cats] && params_[:cats].any?
  ads = ads.search(params_[:kwds]) if params[:kwds] && !params_[:kwds].empty?

  search_count = ads.count
  ads = ads.paginate(params_[:page], params_[:per_page]) 
  models = ads.map(&:to_h)

  json({  page: params_[:page],
          perPage: params_[:per_page],
          total: search_count,
          kwds: params_[:kwds],
          cats: params_[:cats],
          models: models })
end

get '/d/work-locations' do
  json(locations: WorkLocation.all.map(&:to_h))
end

get '/d/work-locations/ac' do
  kwds = params[:kwds] 
  json(WorkLocation.search(kwds).map(&:to_h))
end

get '/d/job-categories' do
  json(JobCategory.all.map(&:to_h))
end

get %r{/(?:(zh|de|en)/)?offered-ads/(\d+)/(edit|delete|publish)} do |locale, id, action|
  @locale = current_locale(locale)
  ad = load_and_authorize(id, params[:uuid])
  halt 401 if !ad

  if(action == "publish")
    ad.update_attributes!(published: true, posted_at: Time.now)
  else
    session[:uuid] = ad.uuid
  end

  erb :index
end

get %r{^/(?:(zh|de|en))?.*} do |locale|
  logger.info("session=>#{session[:locale]}")
  @locale = current_locale(locale)
  logger.info("locale=>#{current_locale}")
  erb :index
end

post '/d/offered-ads' do
  begin
    j = parse_json(request.env['rack.input'].read)

    ad = OfferedAd.create!(j)
    send_notification(ad)
    json({message: "ad successfully created"})
  rescue JSON::ParserError
    status 400
    json({message: "invalid JSON format"})
  end
end

put %r{/d/offered-ads/(\d+)} do |id|
  begin
    ad = load_and_authorize(id)
    halt 401 if !ad

    j = parse_json(request.env['rack.input'].read)
    ad.update_attributes!(j)
    json(ad.to_h)
  rescue JSON::ParserError
    status 400
    json({message: "invalid JSON format"})
  end
  
end

delete %r{/d/offered-ads/(\d+)} do |id|
  ad = load_and_authorize(id)
  halt 401 if !ad

  if(ad.destroy)
    json({message: "successfully deleted ad"})
  else
    status 500
    json({message: "could not delete ad"})
   end 
end

post '/d/locales' do
  newLocale = request.env['rack.input'].read.try :strip
  logger.info("newLocale->#{newLocale}")
  if(LOCALES.index(newLocale))
    current_locale(newLocale)
    json({locale: newLocale})
  else
    status 404
    json({message: "locale not found"})
  end
end

helpers do
  def parse_json(json)
    j = JSON.parse(json)
    halt 400 if(!j || j.delete("url").try { |u| u.strip.size > 0 })

    zip = j.delete("work_location_zip").try(:strip)
    loc = WorkLocation.where("zip = ?", zip).first
    loc = WorkLocation.where("zip = '0000'").first if !loc 
    j['work_location_id'] = loc.id
    j
  end

  def load_and_authorize(id, uuid=nil)
    uuid ||= session["uuid"]
    ad = OfferedAd.find id
    return nil if ad.uuid != uuid
    ad
  end
  
  def parse_params(p)
    info = {}
    info[:page] = p[:page] || 1
    per_page = p[:perPage] || 25
    info[:per_page] = per_page.to_i rescue 25
    info[:kwds] = p[:kwds].try(:strip)
    info[:cats] = p[:cats].try { |c| JSON.parse(c) } rescue []
    info
  end

  def send_notification(ad)
    config, via_opts = {}, {}
    YAML.load(IO.read(EMAIL_CONFIG))["via_options"].each do |k,v|
      via_opts[k.to_sym] = v
    end
    config[:via_options] = via_opts 

    links = ["publish", "edit", "delete"].map { |action|
      "#{ROOT_DOMAIN}/#{current_locale}/offered-ads/#{ad.id}/#{action}?uuid=#{ad.uuid}"
    }
    template = YAML.load(IO.read(sprintf(EMAIL_TEMPLATE, current_locale)))
    subject = sprintf(template["template"]["subject"], ad.title)
    body = sprintf(template["template"]["body"], *links)

    config[:from] = "cs@jobs4ants.com"
    config[:to] = ad.email
    config[:body] = body
    config[:subject] = subject
    config[:via] =  :smtp

    Pony.mail(config)
  end

  def current_locale(locale=nil)
    if(locale)
      @current_locale = session[:locale] = locale
    else
      @current_locale ||= (session[:locale] ||= DEFAULT_LOCALE)
    end
  end
end
