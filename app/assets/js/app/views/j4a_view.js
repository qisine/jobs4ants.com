//=require ./notification

App.Views.J4AView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, "handleError");
  },

  notify: function(message, level) {
    this.notification && this.notification.remove();
    var v = this.notification = new App.Views.Notification({message: message, level: level});
    this.$el.prepend(v.render().el);
  },

  notifySuccess: function(message) {
    this.notify(message, "success");
  },

  notifyError: function(message) {
    this.notify(message, "error"); 
  },

  handleError: function(error) {
    this.notifyError(error);
  },
});
