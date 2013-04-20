#encoding: utf-8

require 'yaml'
require 'json'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'sinatra/json'
require 'active_record'
require 'sinatra/activerecord'
require './app/models/base_ad.rb'
Dir["./app/models/*.rb"].each { |f| require f }

set :views, Proc.new { File.join(root, "app", "views") }

get %r{^/(?!d/).*} do
  erb :index
end

get %r{/d/offered-ads/(\d+)/?} do |id|
  begin
    json(OfferedAd.find(id).to_h)
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

get '/d/offered-ads/:id' do
  begin
    json(OfferedAd.where(published: true).find(params[:id]).to_h)
  rescue ActiveRecord::RecordNotFound
    status 404
    json({error: "couldn't find requested record"})
  end
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

post '/offered-ads' do
  begin
    j = JSON.parse(request.env['rack.input'].read)
    halt 400 if(!j || j.delete("url").try { |u| u.strip.size > 0 })

    zip = j.delete("work_location_zip").try(:strip)
    loc = WorkLocation.where("zip = ?", zip).first
    loc = WorkLocation.where("zip = '0000'").first if !loc 
    j['work_location_id'] = loc.id

    OfferedAd.create!(j)
  rescue JSON::ParserError
    400
  end
end

put '/offered-ad/:id' do
end

delete '/offered-ad/:id' do
end

helpers do
  def parse_params(p)
    info = {}
    info[:page] = p[:page] || 1
    per_page = p[:perPage] || 25
    info[:per_page] = per_page.to_i rescue 25
    info[:kwds] = p[:kwds].try(:strip)
    info[:cats] = p[:cats].try { |c| JSON.parse(c) } rescue []
    info
  end
end
