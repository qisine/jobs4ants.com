//= require ../views/offered_ads

App.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "":         "offeredAds",
    offeredAds: "offeredAds",
  },

  initialize: function() {
  },

  offeredAds: function() {
    var sbView = new App.Views.SearchBar;
    App.viewManager.add(sbView).render();
    new App.Views.OfferedAds;
  }
});
