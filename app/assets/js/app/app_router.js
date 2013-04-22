App.AppRouter = Backbone.Router.extend({
  routes: {
    "(/)": "home",
    "offered-ads(/)": "searchOfferedAds",
    "offered-ads/new": "newOfferedAd",
  },

  initialize: function() {
    var vM = this.vM = App.viewManager;
    var self = this;

    this.appBody = new App.Views.J4AView({ el: "#app-body" }),
    //numeric ids
    this.route(/^offered-ads\/(\d+)[\/#]?$/, "showOfferedAd");
    this.route(/^offered-ads\/(\d+)\/edit[\/#]?/, "editOfferedAd");
    this.route(/^offered-ads\/(\d+)\/publish[\/#]?/, "publishOfferedAd");
    this.route(/^offered-ads\/(\d+)\/delete[\/#]?/, "deleteOfferedAd");

    //all other params
    this.route(/^offered-ads\/((?!\d+|new[\/#]?).+)$/,   "searchOfferedAds");

    _.bindAll(this, "navigateTo", "searchOfferedAds");
    App.dispatcher.on("reroute", this.navigateTo);
    App.dispatcher.on("offered_ad:edited", function(id) {
      self.navigate("offered-ads/" + id, {trigger: true});
    });
    App.dispatcher.on("home:search:submit show_offered_ad:search:submit", function(d) {
      var kwds = d.kwds;
      var splat = $.trim(kwds);
      self.searchOfferedAds(splat ? "s/" + kwds : "");
    });
  },

  home: function() {
    var v = new App.Views.Home();
    this.appBody.$el.html(this.vM.add(v).render().el);
  },

  searchOfferedAds: function(splat) {
    var params = this.paramsFromSplat(decodeURIComponent(splat)), cats = this.parseArrayParam(params.cats); 
    console.log("splat => ", splat, "|params =>", params, "|cats =>", cats);
    App.dispatcher.trigger("kwds:change", $.trim(params.kwds));
    App.dispatcher.trigger("cats:change", cats);
    var v = new App.Views.OfferedAds({kwds: params.kwds, page: params.page, cats: _.clone(cats)});
    this.appBody.$el.html(this.vM.add(v).el);
  },

  showOfferedAd: function(id) {
    var v = new App.Views.ShowOfferedAd({modelId: id });
    this.appBody.$el.html(this.vM.add(v).el);
  },

  newOfferedAd: function() {
    var v = new App.Views.NewOfferedAd;
    this.appBody.$el.html(this.vM.add(v).el);
  },
  
  editOfferedAd: function(id) {
    var self = this;
    var ad = App.Models.OfferedAd.create({id: id});
    ad.fetch({
      success: function() {
        var v = new App.Views.EditOfferedAd({model: ad});
        this.appBody.$el.html(self.vM.add(v).el);
      },
      error: this.appBody.handleError,
    });
  },

  publishOfferedAd: function(id) {
    var self = this;
    var ad = App.Models.OfferedAd.create({id: id});
    ad.fetch({
      success: function() {
        var v = new App.Views.PublishOfferedAd({model: ad});
        this.appBody.$el.html(self.vM.add(v).render().el);
      },
      error: this.appBody.handleError,
    });
  },

  deleteOfferedAd: function(id) {
    var self = this;
    var ad = App.Models.OfferedAd.create({id: id});
    ad.fetch({
      success: function() {
        var v = new App.Views.DeleteOfferedAd({model: ad});
        this.appBody.$el.html(self.vM.add(v).render().el);
      },
      error: this.appBody.handleError,
    });
  },


  navigateTo: function(data) {
    var url = this.constructor.urlBuilder(data) || "";
    console.log('reroute to =>', url);
    this.navigate('offered-ads/' + url); //for right now, assuming offered ads is the only resource
  },

  paramsFromSplat: function(splat) {
    var params = {};
    var rgxs = { kwds: /(?:^|\/)s\/([\w\s]+)(?:$|\/)/,
                 cats: /(?:^|\/)c\/([\d-]+)(?:$|\/)/,
                 page: /(?:^|\/)p\/(\d+)(?:$|\/)/ };
    for(key in rgxs) {
      var result = rgxs[key].exec(splat); 
      if(result && result.length >= 2) params[key] = result[1];
    }
    return params;
  },

  parseArrayParam: function(arrayParam) {
    var result = $.trim(arrayParam);
    if(!result) return;
    result = _.reject(result.split("-"), function(e) { $.trim(e) });
    return result.length > 0 ? result : undefined;
  },
});

App.AppRouter.urlBuilder = function(data) {
  var params = [], prefixes = {page: "p/", kwds: "s/", cats: "c/"};
  if(!data || (data && _.isEmpty(data))) return;

  _.each(["kwds","cats", "page"], function(k) {
    var e = data[k], p = prefixes[k];
    if(e && e.join && e.length > 0) {
      params.push(p + e.join("-"));
    } else if(e = $.trim(e)) {
      params.push(p + e.toLowerCase());
    }
  });

  return params.join("/");
}
