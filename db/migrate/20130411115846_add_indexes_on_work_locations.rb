class AddIndexesOnWorkLocations < ActiveRecord::Migration
  def change
    add_index :work_locations, :zip
    add_index :work_locations, :city
    add_index :work_locations, :city_transliterated
    add_index :work_locations, :canton
  end
end
