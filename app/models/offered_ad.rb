class OfferedAd < BaseAd
  attr_accessible :pay, :uuid

  def to_h
    h = super
    [:pay].each do |e|
      h[e] = (self.attributes[e.to_s] || "").to_s
    end
    h
  end
end
