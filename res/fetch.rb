#!/usr/bin/env ruby
#encoding: utf-8

#require 'csv'
require 'nokogiri'
require 'open-uri'
require 'active_record'
require './app/models/base_ad.rb'
Dir["./app/models/*.rb"].each do |f|
  require f
end

ActiveRecord::Base.configurations =
  YAML::load(IO.read(File.join(File.dirname(__FILE__), "..", "/config/database.yml")))
ActiveRecord::Base.establish_connection(ENV['J4A_ENV'] || "development")

module Mayi
  BASE_URL = "http://www.swissant.com/forum/forum.php?mod=forumdisplay&fid=6&filter=typeid&typeid=10&page=%i"
  def self.fetch_links(num)
    url = sprintf(BASE_URL, num)
    puts("fetching page ##{num} (#{url})")
    doc = Nokogiri::HTML(open(url))
    links = doc.css("table > tbody a[class='xst']").map do |l|
      "http://swissant.com/forum/" + l.attributes["href"].value 
    end
  end

  def self.fetch_page(url)
    doc = Nokogiri::HTML(open(url))
    dt = doc.css("div[class='pi'] > div[class='pti'] > div[class='authi'] > em").first.text.strip
    dt = dt =~ /[\d\s:-]+/ ? $&.strip : dt
    usr = doc.css("table tr div[class='pi'] > div[class='authi'] > a[class='xw1']").first.text.strip
    title = doc.css("h1[class='ts'] > a[id='thread_subject']").first.text.strip
    body = doc.css("div[class='pct'] > div[class='pcb'] > div[class='t_fsz'] td[class='t_f']").first.text.strip
    {source: 'swissant', link: url, posted_at: dt, company: usr, title: title, body: body }
  end
end

module Swissinfo
  BASE_URL = "http://forum.swissinfo.ch/viewforum.php?f=32&start=%i"
  def self.fetch_links(num)
    url = sprintf(BASE_URL, (num - 1) * 50)
    puts("fetching page ##{num} (#{url})")
    doc = Nokogiri::HTML(open(url))
    parent = doc.css(".row1 span[class~='topic_read']").map { |n| n.parent.parent.next_sibling }
    links = parent.map do |p| 
      anchor = p.css("a[class='topictitle']").first
      if anchor
        path = anchor.attributes["href"].value.gsub(/&?sid=[^&]*/,'')
        "http://forum.swissinfo.ch/" + path
      end
    end
  end

  def self.fetch_page(url)
    doc = Nokogiri::HTML(open(url))
    dt = doc.css("td[class='gensmall'] > div")[1].text.strip
    dt = dt =~ /发表于 :(.*)/ ? $1.strip : dt
    usr = doc.css("tr > td > b[class='postauthor']").first.text.strip
    title = doc.css("tr[class='row1'] td[class='gensmall'] > div > a").first.text.strip
    body = doc.css("td > div[class='postbody oembed-content']").first.text.strip
    {source: 'swissinfo', link: url, posted_at: dt, company: usr, title: title, body: body }
  end
end

module Tingzi
  BASE_URL = "http://www.tingzi.net/vb/forumdisplay.php?65-工作学习/page%i"
  def self.fetch_links(num)
    url = sprintf(BASE_URL, (num - 1) * 50)
    puts("fetching page ##{num} (#{url})")
    doc = Nokogiri::HTML(open(url))
    parent = doc.css("ol.threads li .title ").map do |l|
      "http://www.tingzi.net/vb/" + l.attributes["href"].value 
    end
  end

  def self.fetch_page(url)
  end
end

module J4ADb
  def self.save_to_db(post)
    existing = OfferedAd.where("link ILIKE ?", post[:link])
    return if existing.any?

    ad = OfferedAd.new(post) 
    ad.email = "foo@bar.com"
    ad.job_category = JobCategory.where("code = 'OTHER'").first
    puts "saving ad => #{ad.title}"
    ad.save!
  end 
end

def fetch_all(src, from=1, to=50, &block)
  from = 1 unless from
  to = 50 unless to
  (from..to).to_a.each do |n|
    begin
      links = src::fetch_links(n) 
    rescue Exception => e
      STDERR.puts("link:level =>", e)
    end
    links.map do |l|
      begin
        h = src::fetch_page(l) 
        if block
          return if !block.call(h) 
        end
      rescue Exception => e
        STDERR.puts("page:level =>", e)
      end
      sleep(3)
    end
  end
end

def process_bg
  [Mayi, Swissinfo].each do |src|
    fetch_all(src) { |h| J4ADb::save_to_db(h) }
  end
end

def process_fg(opts = {})
  src = Kernel.const_get(opts[:src] || "Mayi")
  fetch_all(src, opts[:from], opts[:to]) do |h|
    puts (h.values).join(",")
  end
end

if(ENV['J4A_BG'])
  process_bg
else
  src, from, to = ARGV
  from = !from || from.strip.empty? ? nil : from.to_i 
  to = !to || to.strip.empty? ? nil : to.to_i 
  process_fg(src: src, from: from, to: to)
end
