require 'rubygems'
require 'bundler'

Bundler.require
 
require 'sprockets'

project_root = File.expand_path(File.dirname(__FILE__))
assets = Sprockets::Environment.new(project_root) do |env|
  env.logger = Logger.new(STDOUT)
end
 
assets.append_path(File.join(project_root, 'app', 'assets'))
assets.append_path(File.join(project_root, 'app', 'assets', 'js'))
assets.append_path(File.join(project_root, 'app', 'assets', 'css'))
 
map "/assets" do
  run assets
end
 
Sinatra::Base.set(run: false) #, :env => :production)
 
require './app' #File.expand_path("../main", __FILE__)
run Sinatra::Application

