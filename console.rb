#!/usr/bin/env ruby

require 'irb'
require 'yaml'
require 'active_record'
require './app/models/base_ad.rb'
Dir["./app/models/*.rb"].each { |f| require f }

ActiveRecord::Base.configurations = YAML::load(IO.read('config/database.yml'))
ActiveRecord::Base.establish_connection("development")

IRB.start(__FILE__)
