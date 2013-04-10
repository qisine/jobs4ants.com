FactoryGirl.define do
  factory :base_ad do
    title { Faker::Lorem.sentence(Random.new.rand(3..6)) }
    body { Faker::Lorem.paragraphs(Random.new.rand(2..5)).join("\n") }
    work_location { Faker::Lorem.sentence(Random.new.rand(3..6)) }
    job_category { JobCategory.all.sample }
  end
end
