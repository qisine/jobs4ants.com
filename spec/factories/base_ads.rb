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

    after :build do |ad, evaluator|
      ad.email = Faker::Internet.email
      if(evaluator.external)
        ad.source = BaseAd::SOURCES.sample 
        ad.link = "http://www.swissant.com/forum/forum.php"
      elsif(ad.published)
        ad.posted_at = Time.now - (Random.new.rand(100_000..10_000_000)) 
      end
    end

    after :create do |ad|
    end
  end
end
