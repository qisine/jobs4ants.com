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

post '/offered-ad' do
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
