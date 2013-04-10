class InitialCreateModels < ActiveRecord::Migration
  def up
    create_table "base_ads" do |t|
      t.string   "type"
      t.string   "title"
      t.text     "body"
      t.string   "uuid"
      t.string   "work_location"
      t.integer  "pay"
      t.string   "link"
      t.string   "source"
      t.integer  "job_category_id"
      t.timestamps
    end

    add_index "base_ads", "job_category_id"
    add_index "base_ads", "uuid"

    create_table "job_categories" do |t|
      t.string   "name"
      t.string   "code"
      t.timestamps
    end
  end

  def down
    drop_table :base_ads
    drop_table :job_categories
  end
end
