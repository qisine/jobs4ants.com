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

  ads = OfferedAd.paginate(params_[:page], params_[:per_page]).search(params_[:kwds])
  models = ads.sort { |a,b| a.created_at <=> b.created_at }.reverse.map(&:to_h)
  json({  page: params_[:page],
          perPage: params_[:per_page],
          total: OfferedAd.count,
          models: models })
end

get '/d/work-locations/search' do
  kwds = params[:kwds] || ""

  locs = WorkLocation.search(kwds).all
  json(locations: locs)
end

helpers do
  def parse_params(p)
    info = {}
    info[:page] = p[:page]
    per_page = p[:perPage] || 25
    info[:per_page] = per_page.to_i rescue 25
    info[:kwds] = p[:kwds]
    info
  end
end
