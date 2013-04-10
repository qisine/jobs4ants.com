require 'rubygems'
require 'bundler'

Bundler.require
 
Sinatra::Base.set(run: false) #, :env => :production)
 
require './app' #File.expand_path("../main", __FILE__)
run Sinatra::Application
