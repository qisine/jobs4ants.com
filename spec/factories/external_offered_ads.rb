FactoryGirl.define do
  factory :external_offered_ad, parent: :base_ad, class: 'ExternalOfferedAd' do
    link { Faker::Internet.domain_name }
    source { ExternalOfferedAd::SOURCES.sample }
  end
end
