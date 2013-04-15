//= require ../models/job_category

App.Collections.JobCategories = Backbone.Collection.extend({
  model: App.Models.JobCategory,
  url: 'd/job-categories',

  initialize: function() {
  },

  fetch: function(options) {
    var cache = this.constructor.cache;
    if(cache.size > 0) {
      var c = cache.getAll();
      this.add(c);
      if(options.success) options.success();
      return {};
    }
    var results = Backbone.Collection.prototype.fetch.call(this, options);
    cache.addAll(results);
    return results;
  }

});
App.Collections.JobCategories.cache = new App.Cache;
