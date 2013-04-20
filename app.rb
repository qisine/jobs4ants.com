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
also_reload './app/models/base_ad.rb'
Dir["./app/models/*.rb"].each do |f|
  require f
  also_reload f
end

ROOT_DOMAIN = "http://jobs4ants.com"

set :views, Proc.new { File.join(root, "app", "views") }
enable :sessions

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
  models = ads.sort { |a,b| a.created_at <=> b.created_at }.reverse.map(&:to_h)

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

get %r{/offered-ads/(\d+)/(edit|delete|publish)} do |id, action|
  ad = load_and_authorize(id, params[:uuid])
  halt 401 if !ad

  if(action == "publish")
    ad.update_attributes!(published: true) 
  else
    session[:uuid] ||= {}
    session[:uuid] = ad.uuid
  end

  erb :index
end

get %r{^/(?!d/).*} do
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
    json({message: "ad successfully updated"})
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
    YAML.load(IO.read("./config/email.yml"))["via_options"].each do |k,v|
      via_opts[k.to_sym] = v
    end
    config[:via_options] = via_opts 

    links = ["publish", "edit", "delete"].map { |action| "#{ROOT_DOMAIN}/#{action}?#{ad.uuid}" }
    text = sprintf(IO.read("./app/email/confirmation_notification.txt"), *links)

    config[:to] = ad.email
    config[:subject] = "激活你的招聘贴 【#{ad.title}】"
    config[:via] =  :smtp

    Pony.mail(config)
  end
end
