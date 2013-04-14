//= require ../views/offered_ads

App.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "":         "offeredAds",
    "offered-ads(/p/:page)": "offeredAds",
    "offered-ads/s/:kwds(/p/:page)": "searchOfferedAds",
  },

  initialize: function() {
    _.bindAll(this, "_navigateTo");
    App.dispatcher.on("offeredAds:search:success", this._navigateTo);
    App.dispatcher.on("testy", function() { console.log("hey") });
  },

  offeredAds: function(page) {
    this.searchOfferedAds(null, page)
  },

  searchOfferedAds: function(kwds, page) {
    if(kwds) kwds = $.trim(decodeURIComponent(kwds));
    var sbView = new App.Views.SearchBar;
    App.viewManager.add(sbView).render();
    new App.Views.OfferedAds({kwds: kwds, page: page});
  },

  _navigateTo: function(data) {
    var finalStr = $.trim(data["page"]);
    if(finalStr) finalStr = "p/" + finalStr; 
    var kwdStr = $.trim(data["kwds"]);
    if(kwdStr) {
      kwdStr = kwdStr.toLowerCase()
      finalStr = "s/" + kwdStr + "/" + finalStr;
    }
    this.navigate("offered-ads/" + finalStr); 
  },
});
