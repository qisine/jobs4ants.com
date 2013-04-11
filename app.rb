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
  page = params[:page]
  per_page = params[:perPage] || 25
  per_page = per_page.to_i rescue 25
  split = per_page / 2
   
  offered_ads = OfferedAd.paginate(page, per_page - split).all 
  ex_ads = ExternalOfferedAd.paginate(page, split).all
  models = (offered_ads + ex_ads).sort { |a,b| a.created_at <=> b.created_at }.reverse.map(&:to_h)
  json({ page: page, perPage: per_page, total: OfferedAd.count + ExternalOfferedAd.count, models: models })
end

helpers do
end
