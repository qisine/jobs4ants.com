App.Views.NewOfferedAd = Backbone.View.extend({
  type: "newOfferedAd",
  tmpl: JST["js/app/templates/offered_ads/new"],
  el: "#app-body",

  initialize: function() {
    _.bindAll(this, "render");

    var c = this.cats = new App.Collections.JobCategories;
    c.fetch({
      success: this.render,
      error: function(error) {
        App.dispatcher.trigger("error:load", error);
      },
    });
  },

  render: function() {
    this.$el.html(this.tmpl({cats: this.cats}));
    return this;
  },

  onClose: function() {
  },
});