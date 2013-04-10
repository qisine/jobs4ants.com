window.App = window.App || { Collections: {}, Models: {}, Routers: {}, Views: {}, };
App.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "":         "offeredAds",
    offeredAds: "offeredAds",
  },

  offeredAds: function() {
    var ads = new App.Collections.OfferedAds;
    var adsView = new App.Views.OfferedAds({collection: ads.fetch() });
    App.viewManager.add(adsView);
    adsView.render();
  }
});
