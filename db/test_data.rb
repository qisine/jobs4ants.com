unless Object.const_defined?('FactoryGirl')
  require 'factory_girl'
  require 'faker'
  FactoryGirl.find_definitions
end

def start_producing
  OfferedAd.delete_all
  ExternalOfferedAd.delete_all

  ActiveRecord::Base.silence { create_offered_ads }
#  create_external_ads
end

def create_offered_ads
  78.times.each do
    FactoryGirl.create(:offered_ad)
  end
end

def create_external_ads
  20.times.each do
    FactoryGirl.create(:external_offered_ad)
  end
end

start_producing

puts "Test data created!"
