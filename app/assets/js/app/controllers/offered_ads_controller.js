App.Controllers.OfferedAdsController = (function(Backbone, $, _) {
  Controller = function() {
    this.handleError = this.options.handleError;
  },

  _.extend(Controller.prototype, Backbone.Events, {
    fetchOfferedAds: function(options) {
      var c = this.collection = (this.collection || new App.Collections.OfferedAds(options));

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

  return Controller;
})(Backbone, $, _);
