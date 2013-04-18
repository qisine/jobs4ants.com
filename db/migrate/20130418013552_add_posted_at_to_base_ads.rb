class AddPostedAtToBaseAds < ActiveRecord::Migration
  def change
    add_column :base_ads, :posted_at, :datetime
  end
end
