App.Views.PublishOfferedAd = App.Views.J4AView.extend({
  type: "publishOfferedAd",
  tmpl: JST["js/app/templates/offered_ads/publish"],

  initialize: function() {
    this.model = this.options.model;
  },

  render: function() {
    this.$el.html(this.tmpl({model: this.model}));
  },

  onClose: function() {
  }
});
