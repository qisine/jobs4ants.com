window.App = window.App || { Collections: {}, Models: {}, Routers: {}, Views: {}, };
App.Views.OfferedAds = Backbone.View.extend({
  type: "indexOfferedAds",
  template: JST["offeredAds"],
  el: $("#app"),

  initialize: function() {
    this.collection = this.options.collection;
  },

  render: function() {
    this.$el.html(this.template({collection: this.collection}));
    return this;
  },

  close: function() {
    $el.remove("#" + type);
  }
});
