require 'securerandom'

FactoryGirl.define do
  factory :base_ad do
    ignore do
      external false
    end

    company { Faker::Company.name }
    title { Faker::Lorem.sentence(Random.new.rand(3..6)) }
    body { Faker::Lorem.paragraphs(Random.new.rand(2..5)).join("\n") }
    published { [true, false].sample }
    work_location { WorkLocation.all.sample }
    job_category { JobCategory.all.sample }
    posted_at { Time.now - (Random.new.rand(100_000..10_000_000)) }

    after :build do |ad, evaluator|
      ad.uuid = SecureRandom.uuid if ad.published
      if(evaluator.external)
        ad.source = BaseAd::SOURCES.sample 
        ad.link = "http://www.swissant.com/forum/forum.php"
      else
        ad.email = Faker::Internet.email
      end
    end

    after :create do |ad|
    end
  end
end
