class JobCategory < ActiveRecord::Base
  attr_accessible :code, :name
  has_many :offered_ads

  def i18n_index
    "job_categories.#{code}"
  end
end
