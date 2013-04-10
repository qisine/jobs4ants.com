class BaseAd < ActiveRecord::Base
  attr_accessible :body, :title, :type, :work_location
  belongs_to :job_category

  validates :body, :title, :job_category_id, presence: true
end

