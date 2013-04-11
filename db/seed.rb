require 'csv'
CATS_FILE = File.join(".", "spec", "fixtures", "job_categories", "job_categories.csv")
LOCATIONS_FILE = File.join(".", "spec", "fixtures", "work_locations", "full_zip_table.csv")

def create_job_categories
  JobCategory.delete_all

  cats = []
  CSV.read(CATS_FILE).each do |r|
    cats << {code: r[0], name: r[1]}
  end
  JobCategory.silence { JobCategory.create!(cats) }
end

def create_work_locations
  WorkLocation.delete_all

  locations = []
  CSV.foreach(LOCATIONS_FILE, headers: true) do |r|
    locations << { zip: r["zip"],
                 city: r["city"],
                 city_transliterated: r["city_t"],
                 canton: r["canton"] }
  end
  WorkLocation.silence { WorkLocation.create!(locations) }
end


create_job_categories
puts "Job Cats created"

create_work_locations
puts "Work Locations created"

puts "Seeding done!"
