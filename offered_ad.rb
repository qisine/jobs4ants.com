class OfferedAd < BaseAd
  def to_h
    h = {}
    [:title, :body, :created_at, :updated_at].each do |e|
      h[e] = (self.attributes[e] || "").to_s
    end
    h
  end
end
