class AddCompanyToBaseAds < ActiveRecord::Migration
  def change
    add_column :base_ads, :company, :string
    add_index :base_ads, :company
  end
end
