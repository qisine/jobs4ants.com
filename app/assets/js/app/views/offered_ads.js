//= require ./paginator

App.Views.OfferedAds = Backbone.View.extend({
  type: "indexOfferedAds",
  tmpl: JST["js/app/templates/offered_ads/index"],

  initialize: function() {
    _.bindAll(this, "render", "parseOptions", "handleUpdates");
    this.data = this.parseOptions(this.options);

    App.dispatcher.on("filter:submit search:submit", this.handleUpdates);
    this.fetchCollection(this.options.kwds, this.options.page);
  },

  fetchCollection: function() {
    console.log(this.data);
    var c = this.collection = new App.Collections.OfferedAds(_.clone(this.data));
    var self = this;
    c.on("reset", this.render);
    c.on("paginate:success", function(data) {
      App.dispatcher.trigger("reroute", _.clone(data));
    });
    c.fetch({
      data: _.clone(this.data),
      success: function(resp, status, xhr) {
        App.dispatcher.trigger("reroute", _.clone(self.data));
      },
    });
  },

  handleUpdates: function(params) {
    _.extend(this.data, this.parseOptions(params));
    this.fetchCollection();
  },

  render: function() {
    this.vwCats = new App.Views.JobCategories({cats: _.clone(this.data.cats)}).render();
    this.$el.html(this.tmpl({collection: this.collection }));
    this.vwPaginator = new App.Views.Paginator({collection: this.collection});
    this.$el.find("#offered-ads").append(this.vwPaginator.render().$el);
    this.$el.find("#job-categories").append(this.vwCats.$el);
    this.vwSearchBar = new App.Views.SearchBar({ kwds: this.data.kwds }).render();
    this.$el.prepend(this.vwSearchBar.$el);
    return this;
  },

  onClose: function() {
    App.dispatcher.off("filter:submit search:submit", this.handleUpdates);
    this.collection.off();
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
