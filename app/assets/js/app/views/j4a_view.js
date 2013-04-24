//=require ./notification
//=require ../view_collection

App.Views.J4AView = Backbone.View.extend({
  errorMessages: {
    401: "errors.authorization",
    404: "errors.not_found",
    default: "errors.generic",
  },

  initialize: function() {
    _.bindAll(this, "handleError");
    this.subviews = new App.ViewCollection;

    if(this.options.model) {
      this.model = this.options.model;
      this.listenTo(this.model, "error", this.handleError);
    }
    if(this.collection) {
       this.collection = this.options.collection;
       this.listenTo(this.collection, "error", this.handleError);
    }
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

  handleError: function(model, error) {
    var msg = error && TR(this.errorMessages[error.status]);
    this.notifyError(msg || TR(this.errorMessages.default));
  },

  onClose: function() {
    this.stopListening();
    this.subviews.closeAll();
  },
});
