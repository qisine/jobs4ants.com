//= require ../views/offered_ads

App.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "":         "offeredAds",
    offeredAds: "offeredAds",
  },

  initialize: function() {
  },

  offeredAds: function() {
    var ads = new App.Collections.OfferedAds;
    ads.fetch({
      success: function(resp, status, xhr) {
        var adsView = new App.Views.OfferedAds({ collection: ads });
        App.viewManager.add(adsView);
        adsView.render();
      },
      error: function() {
        console.log("error!!");
      }
    });
  }
});
