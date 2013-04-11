App.Views.Notification = Backbone.View.extend({
  type: "Notification",
  tmpl: JST["js/app/templates/shared/notification"],
  el: "#notification-area",
  events: {
    "click a.dismissor" : "close",
  },

  initialize: function() {
    _.bindAll(this, "close");
    this.message = this.options.message;
    this.level = this.options.level;
  },

  render: function() {
    this.$el.html(this.tmpl({message: this.message, level: this.level}));
    return this;
  },

  onClose: function() {
  }
});
