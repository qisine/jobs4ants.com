class OfferedAd < BaseAd
  attr_accessible :pay, :uuid, :job_category_id

  validates :uuid, presence: true
end
