//= require ./paginator

App.Views.OfferedAds = Backbone.View.extend({
  type: "indexOfferedAds",
  tmpl: JST["js/app/templates/offered_ads/index"],
  el: "#app-body",

  initialize: function() {
    _.bindAll(this, "render", "parseOptions");
    this.data = this.parseOptions(this.options);
    var self = this;

    App.dispatcher.on("filter:submit search:submit", function(params) {
      _.extend(self.data, self.parseOptions(params));
      self.fetchCollection();
    });

    this.fetchCollection(this.options.kwds, this.options.page);
  },

  fetchCollection: function() {
    console.log(this.data);
    var c = this.collection = new App.Collections.OfferedAds(_.clone(this.data));
    var self = this;
    c.on("reset", this.render);
    c.on("paginate:success", function(data) {
      App.dispatcher.trigger("reroute", _.clone(data));
      //self.render();
    });
    c.on("paginate:error", function(error) {
      console.log("error!", error);
      App.dispatcher.trigger("error:load", error);
    });
    c.fetch({
      data: _.clone(this.data),
      success: function(resp, status, xhr) {
        App.dispatcher.trigger("reroute", _.clone(self.data));
        //self.render();
      },
      error: function(error) {
        console.log("error!", error);
        App.dispatcher.trigger("error:load", error);
      },
    });
  },

  render: function() {
    this.vwCats = new App.Views.JobCategories({cats: _.clone(this.data["cats"])}).render();
    this.$el.html(this.tmpl({collection: this.collection }));
    this.vwPaginator = new App.Views.Paginator({collection: this.collection});
    this.$el.find("#offered-ads").append(this.vwPaginator.render().$el);
    this.$el.find("#job-categories").append(this.vwCats.$el);
    this.vwSearchBar = new App.Views.SearchBar({ kwds: this.data["kwds"] }).render();
    this.$el.prepend(this.vwSearchBar.$el);
    return this;
  },

  onClose: function() {
    this.collection.off;
    this.vwPaginator && this.vwPaginator.close();
    this.vwCats && this.vwCats.close();
    this.vwSearchBar && this.vwSearchBar.close();
  },

  parseOptions: function(opts) {
    var d = opts || {};
    if(opts.resetCats) 
      d.cats = [];
    else if(opts.cats && opts.cats.length > 0)
      d.cats = _.clone(opts.cats);
    if(opts.kwds) d.kwds = $.trim(opts.kwds);
    if(opts.page) d.page = parseInt(opts.page, 10) || 1;
    return d;
  },
});
