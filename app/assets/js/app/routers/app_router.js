//= require ../views/offered_ads

App.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "":         "offeredAds",
    "offered-ads(/p/:page)": "offeredAds",
    "offered-ads/s/:kwds(/p/:page)": "searchOfferedAds",
    "offered-ads/:id" : "showOfferedAd",
  },

  initialize: function() {
    var vM = this.vM = App.viewManager;
    var self = this;

    _.bindAll(this, "_navigateTo");
    App.dispatcher.on("reroute", this._navigateTo);
    App.dispatcher.on("error:load", this._handleError);
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

  showOfferedAd: function(id) {

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

  _handleError: function(error) {
    App.viewManager.add(new App.Views.Notification({message: "囧，错误！", level: "error"})).render();
  },
});
