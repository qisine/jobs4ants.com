//= require ../views/offered_ads

App.Routers.AppRouter = Backbone.Router.extend({
  routes: {
    "":                     "home",
    "offered-ads(/*splat)":   "searchOfferedAds",
    "offered-ads/:id" :     "showOfferedAd",
  },

  initialize: function() {
    var vM = this.vM = App.viewManager;
    var self = this;

    _.bindAll(this, "navigateTo");
    App.dispatcher.on("reroute", this.navigateTo);
    App.dispatcher.on("error:load", this.handleError);
    vM.add(new App.Views.SearchBar).render();
    vM.add(new App.Views.JobCategories).render();
  },

  home: function() {
    this.navigate("offered-ads", {trigger: true});
  },

  searchOfferedAds: function(splat) {
    console.log("splat => ", splat);
    var params = this.paramsFromSplat(decodeURIComponent(splat)), cats = this.parseArrayParam(params["cats"]); 
    App.dispatcher.trigger("kwds:change", $.trim(params["kwds"]));
    App.dispatcher.trigger("cats:change", cats);
    new App.Views.OfferedAds({kwds: params["kwds"], page: params["page"], cats: cats});
  },

  showOfferedAd: function(id) {
    new App.Views.ShowOfferedAd({modelId: id });
  },

  navigateTo: function(data) {
    var url = this.constructor.urlBuilder(data);
    this.navigate(url); 
  },

  paramsFromSplat: function(splat) {
    var params = {}, rgxs = { kwds: /\/s\/(\w+)\//, cats: /\/c\/(\w+)\//, page: /\/p\/(\d+)\// };
    for(key in rgxs) {
      var result = rgxs[key].exec(splat); 
      if(result && result.length >= 2) params[key] = result[1];
    }
    return params;
  },

  parseArrayParam: function(arrayParam) {
    var result = $.trim(arrayParam);
    if(!result) return;
    result = result.split(",");
    return result.length > 1 ? result : undefined;
  },
 
  handleError: function(error) {
    App.viewManager.add(new App.Views.Notification({message: "囧，错误！", level: "error"})).render();
  },
});

App.Routers.AppRouter.urlBuilder = function(data) {
  var root = "/", params = [], prefixes = {page: "p/", kwds: "s/", cats: "c/"};
  if(!data || (data && _.isEmpty(data))) return root;

  _.each(["kwds", "page", "cats"], function(k) {
    var e = data[k], p = prefixes[k];
    if(e && e.join && e.length > 0) {
      params.push(p + e.join(","));
    } else if(e = $.trim(e)) {
      params.push(p + e.toLowerCase());
    }
  });

  return root + params.join("/");
}
//adapted from https://github.com/tbranyen/backbone-boilerplate/blob/master/app/main.js
$(document).on("click", "a[href]", function(ev) {
  var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
  var root = location.protocol + "//" + location.host + (App.root || "");

  if (href.prop.slice(0, root.length) === root) {
    ev.preventDefault();

    Backbone.history.navigate(href.attr, true);
  }
});

