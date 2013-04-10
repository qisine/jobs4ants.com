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
  json OfferedAd.all.map(&:to_h)
end

helpers do
end
