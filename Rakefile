require 'sinatra/activerecord/rake'
require 'rspec/core/rake_task'
require './app'

SEED_FILE = File.join(".", "db", "seed.rb")
TEST_DATA_FILE = File.join(".", "db", "test_data.rb")

namespace :db do
  desc 'Seed Db'
  task :seed do
    load(SEED_FILE) if File.exist?(SEED_FILE) && !ENV['NOSEED']
  end

  desc 'Create Test Data'
  task :test_data => :seed do
    load(TEST_DATA_FILE) if File.exist?(TEST_DATA_FILE)
  end
end

namespace :test do
  desc "Run Specs"
  RSpec::Core::RakeTask.new
end


