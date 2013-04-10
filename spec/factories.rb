Faker::Config.locale = "en"

FactoryGirl.define do
  sequence(:email){|n| "#{Faker::Internet.user_name}#{n}@example.com"}
  sequence(:password){|n| "mypasswd#{n}"}
end
