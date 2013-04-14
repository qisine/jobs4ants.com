class JobCategory < ActiveRecord::Base
  attr_accessible :code, :name
  has_many :offered_ads

  def i18n_index
    "job_categories.#{code}"
  end

  def to_h
    h = {}
    [:id, :name].each do |e|
      h[e] = (self.attributes[e.to_s] || "").to_s
    end
    h
  end
end
