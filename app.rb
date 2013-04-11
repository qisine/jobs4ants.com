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
  page_info = get_pagination_info(params)

  offered_ads = OfferedAd.paginate(page_info[:page], page_info[:per_page] - page_info[:split]).all 
  ex_ads = ExternalOfferedAd.paginate(page_info[:page], page_info[:split]).all
  models = (offered_ads + ex_ads).sort { |a,b| a.created_at <=> b.created_at }.reverse.map(&:to_h)
  json({  page: page_info[:page],
          perPage: page_info[:per_page],
          total: OfferedAd.count + ExternalOfferedAd.count,
          models: models })
end

get '/d/offered-ads/search' do
  kwd = params[:kwd] || ""
  page_info = get_pagination_info(params)
end

get '/d/work-locations/search' do
  kwd = params[:kwd] || ""

  locs = WorkLocation.search(kwd).all
  json(locations: locs)
end

helpers do
  def get_pagination_info(p)
    info = {}
    info[:page] = p[:page]
    per_page = p[:perPage] || 25
    info[:per_page] = per_page.to_i rescue 25
    info[:split] = per_page / 2
    info
  end
end
