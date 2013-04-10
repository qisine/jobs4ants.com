require 'sinatra/activerecord/rake'
require 'rspec/core/rake_task'
require './app'

namespace :db do
  desc 'Seed Db'
  task :seed do
    f = File.join(".", "db", "seed.rb")
    load(f) if File.exist?(f)
  end

  desc 'Create Test Data'
  task :test_data => :seed do
    f = File.join(".", "db", "test_data.rb")
    load(f) if File.exist?(f)
  end
end

namespace :test do
  desc "Run Specs"
  RSpec::Core::RakeTask.new
end


