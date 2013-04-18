class BaseAd < ActiveRecord::Base
  SOURCES = %w{ swissant swissinfo tingzi }

  attr_accessible :company, :body, :title, :link, :source, :type, :work_location_id, :job_category_id, :published, :posted_at
                  :uuid
  belongs_to :job_category
  belongs_to :work_location

  validates :company, :body, :title, :job_category_id, presence: true
  validate :has_correct_source

  scope :paginate, ->(page=1, per_page=25) do
    page = page.to_i rescue 1
    page = 1 if !page.between?(1, 9999)

    per_page = per_page.to_i rescue 25
    per_page = 25 if per_page < 1
    
    return scoped if per_page >= self.count
    order("created_at desc").offset((page-1) * per_page).limit(per_page)
  end

  scope :search, ->(kwds) do
    kwds = kwds || ""
    joins(:work_location)
    .joins(:job_category)
    .where("company ILIKE ? OR title ILIKE ? OR body ILIKE ? OR work_locations.city ILIKE ? OR work_locations.city_transliterated ILIKE ? OR job_categories.name ILIKE ?", *(["%#{kwds}%"]*6))
  end

  def has_correct_source
    if(source && !SOURCES.index(source))
      errors.add(:source, "source not included in the list")
    end
  end

  def to_h
    h = {}
    [:id, :type, :body, :title, :source, :link, :company].each do |e|
      h[e] = (self.attributes[e.to_s] || "").to_s
    end
    h[:posted_at] = posted_at.strftime("%Y-%m-%d %H:%M")
    h[:job_category] = job_category.to_h
    h[:work_location] = work_location.to_h
    h
  end
end
