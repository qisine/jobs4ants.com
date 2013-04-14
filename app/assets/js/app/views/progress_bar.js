App.Views.ProgressBar = Backbone.View.extend({
  type: "progressBar",
  tmpl: JST["js/app/templates/shared/progress_bar"],
  el: "#progress-bar",

  initialize: function() {
    _.extend(this, this.options);
  },

  render: function() {
    this.$el
      .html(this.tmpl({message: this.message}))
      .toggle();
  },

  onClose: function() {
    this.$el.toggle();
  }
});
