class ExternalOfferedAd < BaseAd
  SOURCES = [:swissant, :swissinfo, :tingzi]

  attr_accessible :link, :source

  validates :link, :source, presence: true
  validates :source, inclusion: { in: SOURCES }

  def to_h
    h = super
    [:link, :source].each do |e|
      h[e] = (self.attributes[e.to_s] || "").to_s
    end
    h
  end
end
