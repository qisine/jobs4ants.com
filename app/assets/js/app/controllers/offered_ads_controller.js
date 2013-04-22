App.Controllers.OfferedAdsController = Backbone.View.extend({
  initialize: function() {
    this.handleError = this.options.handleError;
  },

  fetchOfferedAds: function(options) {
    var c = this.collection = new App.Collections.OfferedAds(options);
    c.fetch({
      data: _.clone(options),
      success: function(resp, status, xhr) {
        App.dispatcher.trigger("reroute", options);
      },
      error: this.handleError,
    });

  },

  fetchOfferedAd: function(id) {

  },

});
