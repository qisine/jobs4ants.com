window.App = window.App || { Collections: {}, Models: {}, Routers: {}, Views: {}, };
App.Views.OfferedAds = Backbone.View.extend({
  type: "indexOfferedAds",
  tmpl: JST["js/app/templates/offered_ads/index"],
  el: "#app",

  initialize: function() {
    _.bindAll(this, "render");
    this.collection = this.options.collection;
    this.collection.on("reset", this.render);
  },

  render: function() {
    console.log("in rndr");
    this.$el.html(this.tmpl({models: this.collection.models }));
    this.paginator = new App.Views.Paginator({collection: this.collection});
    this.$el.append(this.paginator.render());
    return this;
  },

  onClose: function() {
    this.collection.off;
    this.paginator.close();
  }
});
