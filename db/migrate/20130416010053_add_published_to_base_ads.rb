class AddPublishedToBaseAds < ActiveRecord::Migration
  def change
    add_column :base_ads, :published, :boolean, default: false
  end
end
