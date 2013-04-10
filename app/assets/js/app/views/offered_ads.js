window.App = window.App || { Collections: {}, Models: {}, Routers: {}, Views: {}, };
App.Views.OfferedAds = Backbone.View.extend({
  type: "indexOfferedAds",
  tmpl: JST["offeredAds"],
  el: "#app",

  initialize: function() {
    this.collection = this.options.collection;
  },

  render: function() {
    this.$el.html(_.template(this.tmpl)({c: this.collection.models }));
    return this;
  },

  close: function() {
    $el.remove("#" + type);
  }
});
