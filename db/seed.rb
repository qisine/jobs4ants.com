require 'csv'
JOB_CATS_FILE = File.join(".", "spec", "fixtures", "job_categories", "job_categories.csv")

def create_job_categories
  JobCategory.delete_all

  CSV.read(JOB_CATS_FILE).each do |r|
    JobCategory.create!(code: r[0], name: r[1])
  end
end

create_job_categories
puts "Job Cats created"
puts "Seeding done!"
