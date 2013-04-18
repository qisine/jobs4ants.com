#!/usr/bin/env ruby
#encoding: utf-8

require 'csv'
require 'nokogiri'
require 'open-uri'

module EF
  BASE_URL = "http://www.englishforum.ch/free-stuff/index%i.html"
  def self.fetch_links(num)
    url = sprintf(BASE_URL, num)
    puts("fetching page ##{num} (#{url})")
    doc = Nokogiri::HTML(open(url))
    links = doc.css("#threadbits_forum_17 td[class='alt1'] > div > a").map { |l| l.attributes["href"].value }
  end

  def self.fetch_page(url)
    puts("fetching post (#{url})")
    doc = Nokogiri::HTML(open(url))
    arr = []
    dt = doc.css("#posts > div table td[class='thead'] div:nth-child(2)").first.text.strip
    usr = doc.css("#posts a[class='bigusername']").first.text.strip
    title = doc.css("#posts td[class='alt1'] > div[class='smallfont'] strong").first.text.strip
    body = doc.css("#posts td[class='alt1'] > div[class='KonaBody']").first.text.strip
    [dt, usr, title, body]
  end
end

module MY
  BASE_URL = "http://www.swissant.com/forum/forum.php?mod=forumdisplay&fid=6&filter=typeid&typeid=9&page=%i"
  def self.fetch_links(num)
    url = sprintf(BASE_URL, num)
    puts("fetching page ##{num} (#{url})")
    doc = Nokogiri::HTML(open(url))
    links = doc.css("table > tbody a[class='xst']").map do |l|
      "http://swissant.com/forum/" + l.attributes["href"].value 
    end
  end

  def self.fetch_page(url)
    puts("fetching post (#{url})")
    doc = Nokogiri::HTML(open(url))
    arr = []
    dt = doc.css("div[class='pi'] > div[class='pti'] > div[class='authi'] > em").first.text.strip
    dt = dt =~ /[\d\s:-]+/ ? $&.strip : dt
    usr = doc.css("table tr div[class='pi'] > div[class='authi'] > a[class='xw1']").first.text.strip
    title = doc.css("h1[class='ts'] > a[id='thread_subject']").first.text.strip
    body = doc.css("div[class='pct'] > div[class='pcb'] > div[class='t_fsz'] td[class='t_f']").first.text.strip
    [dt, usr, title, body]
  end
end

module SI
  BASE_URL = "http://forum.swissinfo.ch/viewforum.php?f=32&sid=2d94a121178f46232aac69d303cf3400"
  def self.fetch_links(num)
    url = sprintf(BASE_URL, num)
    puts("fetching page ##{num} (#{url})")
    doc = Nokogiri::HTML(open(url))
    links = doc.css(".row1 > a[class='topictitle']").map do |l| 
      "http://forum.swissinfo.ch/" + l.attributes["href"].value 
    end
    links[2..-1]
  end

  def self.fetch_page(url)
    puts("fetching post (#{url})")
    doc = Nokogiri::HTML(open(url))
    arr = []
    dt = doc.css("td[class='gensmall'] > div")[1].text.strip
    dt = dt =~ /发表于 :(.*)/ ? $1.strip : dt
    usr = doc.css("tr > td > b[class='postauthor']").first.text.strip
    title = doc.css("tr[class='row1'] td[class='gensmall'] > div > a").first.text.strip
    body = doc.css("td > div[class='postbody oembed-content']").first.text.strip
    [dt, usr, title, body]
  end
end
def go(opts = {})
  outfile = opts[:outfile] || "output.csv"
  src = Kernel.const_get(opts[:src] || "MY")
  puts "saving output to [#{outfile}]"
  (1..5).to_a.each do |n|
    links = src::fetch_links(n) rescue []
    links.each do |l|
      arr = src::fetch_page(l) rescue []
      CSV.open(outfile, "a", col_sep: "|") do |csv|
        csv << ["swissinfo"] + arr
      end
      sleep(3)
    end
  end
end

go(src: ARGV.shift, outfile: ARGV.shift)
