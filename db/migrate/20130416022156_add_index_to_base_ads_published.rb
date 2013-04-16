class AddIndexToBaseAdsPublished < ActiveRecord::Migration
  def change
    add_index :base_ads, :published
  end
end
