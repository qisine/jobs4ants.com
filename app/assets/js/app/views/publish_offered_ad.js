App.Views.PublishOfferedAd = Backbone.View.extend({
  type: "publishOfferedAd",
  tmpl: JST["js/app/templates/offered_ads/publish"],
  el: "#app-body",

  initialize: function() {
    this.model = this.options.model;
  },

  render: function() {
    this.$el.html(this.tmpl({model: this.model}));
  },

  onClose: function() {
  }
});
