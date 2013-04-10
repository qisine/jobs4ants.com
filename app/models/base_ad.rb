class BaseAd < ActiveRecord::Base
  attr_accessible :body, :title, :type, :work_location, :job_category_id
  belongs_to :job_category

  validates :body, :title, :job_category_id, presence: true

  scope :paginate, ->(page=1, per_page=25) do
    page = page.to_i rescue 1
    page = 1 if page < 1

    per_page = per_page.to_i rescue 25
    per_page = 25 if per_page < 1

    order("created_at desc").offset((page-1) * per_page).limit(per_page)
  end

  def to_h
      h = {}
      [:type, :body, :title, :work_location].each do |e|
        h[e] = (self.attributes[e.to_s] || "").to_s
      end
      h[:job_category] = job_category.name
      h
  end
end
