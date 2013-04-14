//= require ../models/offered_ad

App.Collections.OfferedAds = Backbone.Collection.extend({
  model: App.Models.OfferedAd,
  url: 'd/offered-ads',

  initialize: function() {
    _.bindAll(this, "parse", "fetch", "pageInfo", "nextPage", "previousPage");
    this.page = 1;
    this.perPage = (this.perPage || 25);
  },

  fetch: function(options) {
    this.trigger("fetching");

    var options = (options || {});
    options.data = (options.data || {});
    _.defaults(options.data, { page: this.page, perPage: this.perPage });

    options.reset = true;
    var collection = this;
    if(options.success) {
      success = options.success;
      options.success = function(response) {
        collection.trigger("fetched");
        success(response);
      }
    } else {
    }
    return Backbone.Collection.prototype.fetch.call(this, options) ;
  },

  parse: function(response, xhr) {
    this.page = parseInt(response.page, 10) ;
    this.total = response.total;
    this.perPage = response.perPage;
    return response.models ;
  },

  pageInfo: function() {
    var info = {
      total: this.total,
      page: this.page,
      perPage: this.perPage,
      pages: Math.ceil(this.total / this.perPage),
      prev: 0,
      next: 0,
    };

    if(this.page > 1) info.prev = this.page - 1;
    if(this.page < info.pages) info.next = this.page + 1;

    return info;
  },

  goTo: function(page) {
    if(page > this.pageInfo().pages  || page < 1) return;
    this.page = page;
    return this.fetch();
  },

  nextPage: function() {
    this.goTo(this.page + 1);
  },

  previousPage: function() {
    this.goTo(this.page - 1);
  },
});
