App.AppRouter = Backbone.Router.extend({
  routes: {
    "(/)": "home",
    "offered-ads(/)": "searchOfferedAds",
    "offered-ads/new": "newOfferedAd",
  },

  initialize: function() {
    var vM = this.vM = App.viewManager;
    var self = this;

    //numeric ids
    this.route(/^offered-ads\/(\d+)[\/#]?$/, "showOfferedAd");
    this.route(/^offered-ads\/(\d+)\/edit[\/#]?/, "editOfferedAd");
    this.route(/^offered-ads\/(\d+)\/publish[\/#]?/, "publishOfferedAd");
    this.route(/^offered-ads\/(\d+)\/delete[\/#]?/, "deleteOfferedAd");

    //all other params
    this.route(/^offered-ads\/((?!\d+|new[\/#]?).+)$/,   "searchOfferedAds");

    _.bindAll(this, "navigateTo", "searchOfferedAds", "handleError");
    App.dispatcher.on("reroute", this.navigateTo);
    App.dispatcher.on("error:load", this.handleError);
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
    var v = new App.Views.Home().render();
    //this.vM.add(v).render();
  },

  searchOfferedAds: function(splat) {
    var params = this.paramsFromSplat(decodeURIComponent(splat)), cats = this.parseArrayParam(params.cats); 
    console.log("splat => ", splat, "|params =>", params, "|cats =>", cats);
    App.dispatcher.trigger("kwds:change", $.trim(params.kwds));
    App.dispatcher.trigger("cats:change", cats);
    var v = new App.Views.OfferedAds({kwds: params.kwds, page: params.page, cats: _.clone(cats)});
    this.vM.add(v);
  },

  showOfferedAd: function(id) {
    var v = new App.Views.ShowOfferedAd({modelId: id });
    this.vM.add(v);
  },

  newOfferedAd: function() {
    var v = new App.Views.NewOfferedAd;
    this.vM.add(v);
  },
  
  editOfferedAd: function(id) {
    var self = this;
    var ad = App.Models.OfferedAd.create({id: id});
    ad.fetch({
      success: function() {
        var v = new App.Views.EditOfferedAd({model: ad});
        self.vM.add(v);
      },
      error: this.handleError,
    });
  },

  publishOfferedAd: function(id) {
    var self = this;
    var ad = App.Models.OfferedAd.create({id: id});
    ad.fetch({
      success: function() {
        var v = new App.Views.PublishOfferedAd({model: ad});
        self.vM.add(v).render();
      },
      error: this.handleError,
    });
  },

  deleteOfferedAd: function(id) {
    var self = this;
    var ad = App.Models.OfferedAd.create({id: id});
    ad.fetch({
      success: function() {
        var v = new App.Views.DeleteOfferedAd({model: ad});
        self.vM.add(v).render();
      },
      error: this.handleError,
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
 
  handleError: function(error) {
    var v = new App.Views.Notification({message: "囧，错误！", level: "error"});
    $("#notification").parent().remove();
    $("#app-body").prepend(v.render().$el);
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

//adapted from https://github.com/tbranyen/backbone-boilerplate/blob/master/app/main.js
/*
 $(document).on("click", "a[href]:not([data-bypass])", function(ev) {
  var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
  var root = location.protocol + "//" + location.host + (App.root || "");

  if (href.prop.slice(0, root.length) === root) {
    ev.preventDefault();

    Backbone.history.navigate(href.attr, true);
  }
});
*/
