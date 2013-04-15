//= require ../views/offered_ads

App.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "":         "offeredAds",
    "offered-ads(/p/:page)": "offeredAds",
    "offered-ads/s/:kwds(/p/:page)": "searchOfferedAds",
  },

  initialize: function() {
    var vM = this.vM = App.viewManager;
    var self = this;

    _.bindAll(this, "_navigateTo");
    App.dispatcher.on("offeredAds:search:success", this._navigateTo);

    vM.add(new App.Views.SearchBar).render();
    vM.add(new App.Views.JobCategories).render();
  },

  offeredAds: function(page) {
    this.searchOfferedAds(null, page)
  },

  searchOfferedAds: function(kwds, page) {
    if(kwds) kwds = $.trim(decodeURIComponent(kwds));
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
