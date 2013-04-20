class AddEmailToBaseAds < ActiveRecord::Migration
  def change
    add_column :base_ads, :email, :string
  end
end
