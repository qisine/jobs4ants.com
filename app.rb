#encoding: utf-8

require 'rubygems'
require 'yaml'
require 'json'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'sinatra/json'
require 'active_record'
require './base_ad.rb'
require './offered_ad.rb'

ActiveRecord::Base.configurations = YAML::load(IO.read('db/database.yml'))
ActiveRecord::Base.establish_connection(development? ? "development" : "production")

get '/' do
  erb :index
end

get '/d/offered_ads' do
  page = params[:page].try(:to_i)
  page = 1 if page < 1

  per_page = params[:perPage].try(:to_i)
  per_page = 25 if per_page < 1
  
  models = OfferedAd.order("created_at desc").offset((page-1) * per_page).limit(per_page).map(&:to_h)
  json({ page: page, perPage: per_page, total: OfferedAd.count, models: models })
end

helpers do
end
