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

get '/' do
  erb :index
end

get '/d/offered-ads' do
  params_ = parse_params(params)

  ads = OfferedAd.published
  ads = ads.search(params_[:kwds]) unless params_[:kwds].try(:empty?)
  search_count = ads.count
  ads = ads.paginate(params_[:page], params_[:per_page]) 
  models = ads.sort { |a,b| a.created_at <=> b.created_at }.reverse.map(&:to_h)

  json({  page: params_[:page],
          perPage: params_[:per_page],
          total: search_count,
          models: models })
end

get '/d/work-locations/search' do
  kwds = params[:kwds] || ""

  locs = WorkLocation.search(kwds).all
  json(locations: locs)
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
    info[:page] = p[:page]
    per_page = p[:perPage] || 25
    info[:per_page] = per_page.to_i rescue 25
    info[:kwds] = p[:kwds].try(:strip)
    info
  end
end
