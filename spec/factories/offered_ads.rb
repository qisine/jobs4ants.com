FactoryGirl.define do
  factory :offered_ad, parent: :base_ad, class: 'OfferedAd' do
    pay { Random.new.rand(20..9999) }
    uuid do
      require 'securerandom'
      SecureRandom.uuid
    end
  end
end
