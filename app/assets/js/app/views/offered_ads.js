//= require ./paginator

App.Views.OfferedAds = App.Views.J4AView.extend({
  type: "indexOfferedAds",
  tmpl: JST["js/app/templates/offered_ads/index"],

  initialize: function() {
    _.bindAll(this, "render", "handleUpdates");
    App.Views.J4AView.prototype.initialize.apply(this);

    this.collection.data = this.collection.parseDataParams(this.options.data);
    this.collection
      .on("reset", this.render)
      .on("paginate:success", function(data) {
        App.dispatcher.trigger("reroute", data);
      })
      .on("paginate:error", this.handleError)
      .fetch({
        success: function(resp, data) {
          App.dispatcher.trigger("reroute", data);
        },
      });

      this.addSubviews();
  },

  addSubviews: function() {
    this.$el.html(this.tmpl());
    var cv = this.subviews
      .add(new App.Views.JobCategories(
        {collection: new App.Collections.JobCategories(), cats: this.collection.data.cats}))
      .on("filter:submit", this.handleUpdates)
      .on("error", this.handleError);
    this.$el.find("#job-categories").append(cv.el);

    var sv = this.subviews.add(new App.Views.SearchBar({ kwds: this.collection.data.kwds }))
      .on("search:submit", this.handleUpdates)
    this.$el.prepend(sv.render().el);

    var pv = this.subviews.add(new App.Views.Paginator({collection: this.collection}));
    this.$el.find("#paginator").html(pv.el);
  },

  handleUpdates: function(data) {
    this.collection.fetch({
      data: data,
      success: function(resp, data) {
        App.dispatcher.trigger("reroute", data);
      },
    });
  },

  render: function() {
    var self = this;

    var Bv = Backbone.View.extend({
      tmpl: JST["js/app/templates/offered_ads/ads_body"],
      render: function() {
        this.$el.html(this.tmpl({collection: self.collection }));
        return this;
      }
    });
    this.$el.find("#offered-ads").html((new Bv).render().el);
    return this;
  },

  onClose: function() {
    this.collection.off();
    this.subviews.closeAll();
    App.Views.J4AView.prototype.onClose.apply(this, arguments);
  },
});
