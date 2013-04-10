window.App = window.App || { Collections: {}, Models: {}, Routers: {}, Views: {}, };
App.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "":         "offeredAds",
    offeredAds: "offeredAds",
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
