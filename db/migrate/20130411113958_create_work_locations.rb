class CreateWorkLocations < ActiveRecord::Migration
  def change  
    create_table :work_locations do |t|
      t.string :zip
      t.string :city
      t.string :city_transliterated
      t.string :city_chinese
      t.string :canton
      
      t.timestamps 
    end
  end
end
