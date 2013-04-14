App.Views.JobCategories = Backbone.View.extend({
  type: "jobCategories",
  tmpl: JST["js/app/templates/shared/job_categories"],
  el: "#job-categories",
  events: {
    "click button": "search",
  },

  initialize: function() {
  },

  filter: function(ev) {
    ev.preventDefault();
  },

  render: function() {
    this.$el.html(this.tmpl());
  },

  onClose: function() {
    this.undelegateEvents();
  }
});
