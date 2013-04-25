App.Views.PublishOfferedAd = App.Views.J4AView.extend({
  type: "publishOfferedAd",
  tmpl: JST["js/app/templates/offered_ads/publish"],

  initialize: function() {
    _.bindAll(this, "render");
    App.Views.J4AView.prototype.initialize.apply(this);
    this.model.fetch().done(this.render);
  },

  render: function() {
    this.$el.html(this.tmpl({model: this.model}));
    return this;
  },
});
