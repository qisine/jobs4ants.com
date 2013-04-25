App.AppRouter = Backbone.Router.extend({
  localeRegexp: /^zh|de|en(?=\/|$)/,

  initialize: function() {
    this.setLocale();
    this.appBody = new App.Views.AppBody;
    this.header = (new App.Views.Header).render();
    this.footer = (new App.Views.Footer).render();

    var self = this;

    //numeric ids
    this.route(/^(?:(zh|de|en)\/?)?\/?$/, "home");
    this.route(/^(?:(zh|de|en)\/)?offered-ads\/?$/, "searchOfferedAds");
    this.route(/^(?:(zh|de|en)\/)?offered-ads\/new/, "newOfferedAd");
    this.route(/^(?:(zh|de|en)\/)?offered-ads\/(\d+)[\/#]?$/, "showOfferedAd");
    this.route(/^(?:(zh|de|en)\/)?offered-ads\/(\d+)\/edit[\/#]?/, "editOfferedAd");
    this.route(/^(?:(zh|de|en)\/)?offered-ads\/(\d+)\/publish[\/#]?/, "publishOfferedAd");
    this.route(/^(?:(zh|de|en)\/)?offered-ads\/(\d+)\/delete[\/#]?/, "deleteOfferedAd");

    //all other params
    this.route(/^(?:(zh|de|en)\/)?offered-ads\/((?!\d+|new[\/#]?).+)$/,   "searchOfferedAds");

    _.bindAll(this, "navigateTo", "searchOfferedAds");
    App.dispatcher.on("reroute", this.navigateTo);
    App.dispatcher.on("offered_ad:edited", function(id) {
      self.navigate(self.locale + "/offered-ads/" + id, {trigger: true});
    });
    App.dispatcher.on("home:search:submit search:submit", function(d) {
      var kwds = d.kwds;
      var splat = $.trim(kwds);
      self.searchOfferedAds(self.locale, splat ? "s/" + kwds : "");
    });
    App.dispatcher.on("locale:changed", function(newLocale) {
      $.ajax({ type: "POST", url: "/d/locales", data: newLocale, dataType: "json"})
        .done(function() {
          var currentRoute = Backbone.history.fragment, newRoute;
          self.setLocale(newLocale);
          if(self.localeRegexp.exec(currentRoute)) 
            newRoute = currentRoute.replace(self.localeRegexp, newLocale);
          else
            newRoute = newLocale + "/" + currentRoute;
          console.log('new locale->', newLocale, 'reroute->', newRoute);
          self.header.render();
          self.footer.render();
          self.navigate(newRoute, {trigger: true});
        })
        .fail(function() {
          var v = new App.Views.Notification({message: "啊呀！不能选择这语言", level: "error"}).render();
          v.$el.prependTo("#app-body").fadeOut(1500, function() { $(this).remove() });
        });
    });
  },

  home: function(locale) {
    this.setLocale(locale);
    this.appBody.home();
  },

  searchOfferedAds: function(locale, splat) {
    this.setLocale(locale);
    var params = this.paramsFromSplat(decodeURIComponent(splat)), cats = this.parseArrayParam(params.cats); 
    console.log('locale =>', locale,"|splat => ", splat, "|params =>", params, "|cats =>", cats);
    this.appBody.offeredAds({kwds: params.kwds, page: params.page, cats: cats});
  },

  showOfferedAd: function(locale, id) {
    this.setLocale(locale);
    this.appBody.showOfferedAd(id);
  },

  newOfferedAd: function(locale) {
    this.setLocale(locale);
    this.appBody.newOfferedAd();
  },
  
  editOfferedAd: function(locale, id) {
    this.setLocale(locale);
    this.appBody.editOfferedAd(id);
  },

  publishOfferedAd: function(locale, id) {
    this.setLocale(locale);
    this.appBody.publishOfferedAd(id);
  },

  deleteOfferedAd: function(locale, id) {
    this.setLocale(locale);
    this.appBody.deleteOfferedAd(id);
  },

  setLocale: function(locale) {
    var l = locale || this.locale || App.currentLocale || App.defaultLocale;
    App.currentLocale = this.locale = l;
  },

  navigateTo: function(data) {
    var url = this.constructor.urlBuilder(data) || "", replace;
    if(/offered-ads\/?$/.exec(Backbone.history.fragment)) replace = true;
    console.log('reroute to =>', this.locale, url, 'replace->', replace);
    this.navigate(this.locale + '/offered-ads/' + url, {replace: replace}); 
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
