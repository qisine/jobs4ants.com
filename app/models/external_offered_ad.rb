class ExternalOfferedAd < BaseAd
  SOURCES = [:swissant, :swissinfo, :tingzi]

  attr_accessible :link, :source

  validates :link, :source, presence: true
  validates :source, inclusion: { in: SOURCES }
end
