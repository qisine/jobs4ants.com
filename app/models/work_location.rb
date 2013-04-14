class WorkLocation < ActiveRecord::Base
  attr_accessible :zip, :city, :city_transliterated, :city_chinese, :canton
  has_many :base_ads

  validate :zip, :city, :canton, presence: true

  scope :search_work_locations, ->(kwd) do
    where("zip ILIKE '?' or city ILIKE '?' or city_transliterated ILIKE '?'", *([kwd]*3))
      .limit(10)
      .order("zip ASC")
  end

  def to_h
    h = {}
    [:id, :zip, :city, :city_transliterated, :canton].each do |e|
      h[e] = (self.attributes[e.to_s] || "").to_s
    end
    h
  end
end
