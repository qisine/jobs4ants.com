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
  page = 0 if page < 0

  per_page = params[:perPage].try(:to_i)
  per_page = 25 if per_page < 1
  
  json OfferedAd.order("created_at desc").offset(page * per_page).limit(per_page).all.map(&:to_h)
end

helpers do
end
