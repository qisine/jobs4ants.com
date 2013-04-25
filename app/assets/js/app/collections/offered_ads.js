//= require ../models/offered_ad

App.Collections.OfferedAds = Backbone.Collection.extend({
  model: App.Models.OfferedAd,
  url: '/d/offered-ads',
  defaultParams: {
    page: 1,
    perPage: 25,
  },

  initialize: function() {
    _.bindAll(this, "parse", "fetch", "pageInfo", "nextPage", "previousPage");
  },

  fetch: function(options) {
    this.trigger("fetching");

    var options = (options || {});
    options.data = (options.data || {});
    _.defaults(options.data, this.data, this.defaultParams);

    var cats = options.data.cats;
    if(cats && cats.length && cats.length > 0) options.data.cats = JSON.stringify(cats);

    options.reset = true;
    var collection = this;
    if(options.success) {
      success = options.success;
      options.success = function(response) {
        collection.trigger("fetched");
        success(response, collection.data);
      }
    } 
    return Backbone.Collection.prototype.fetch.call(this, options) ;
  },

  parse: function(response, xhr) {
    this.data = this.parseDataParams({
      page: response.page,
      total: response.total,
      perPage: response.perPage,
      kwds: response.kwds,
      cats: response.cats,
    });
    return response.models ;
  },

  parseDataParams: function(opts) {
    var d = opts || {};
    if(d.resetCats) 
      d.cats = [];
    else if(d.cats && d.cats.length > 0)
      d.cats = _.clone(d.cats);
    if(d.kwds) d.kwds = $.trim(d.kwds);
    if(d.page) d.page = parseInt(d.page, 10) || 1;
    if(d.total) d.total = parseInt(d.total, 10);
    if(d.perPage) d.perPage = parseInt(d.perPage) || 25;
    return d;
  },

  pageInfo: function() {
    var info = {
      total: this.data.total,
      page: this.data.page,
      perPage: this.data.perPage,
      pages: Math.ceil(this.data.total / this.data.perPage),
      prev: 0,
      next: 0,
    };

    if(this.data.page > 1) info.prev = this.data.page - 1;
    if(this.data.page < info.pages) info.next = this.data.page + 1;

    return info;
  },

  goTo: function(page) {
    if(page > this.pageInfo().pages  || page < 1) return;
    this.data.page = page;
    var self = this;
    return this.fetch({ 
      success: function() { self.trigger("paginate:success", self.data); },
      error: function(error) { self.trigger("paginate:error", { error: error }); }
    });
  },

  nextPage: function() {
    this.goTo(this.data.page + 1);
  },

  previousPage: function() {
    this.goTo(this.data.page - 1);
  },
});
