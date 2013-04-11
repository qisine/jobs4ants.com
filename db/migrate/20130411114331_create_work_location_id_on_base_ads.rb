class CreateWorkLocationIdOnBaseAds < ActiveRecord::Migration
  def up
    remove_column :base_ads, :work_location
    add_column :base_ads, :work_location_id, :integer
    add_index :base_ads, :work_location_id
  end

  def down
    remove_column :base_ads, :work_location_id
    add_column :base_ads, :work_location, :string
  end
end
