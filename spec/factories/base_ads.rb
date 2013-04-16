FactoryGirl.define do
  factory :base_ad do
    title { Faker::Lorem.sentence(Random.new.rand(3..6)) }
    body { Faker::Lorem.paragraphs(Random.new.rand(2..5)).join("\n") }
    source { (BaseAd::SOURCES + [nil]).sample }
    link "http://www.swissant.com/forum/forum.php?mod=forumdisplay&fid=6"
    published { [true, false].sample }
    work_location { WorkLocation.all.sample }
    job_category { JobCategory.all.sample }
  end
end
