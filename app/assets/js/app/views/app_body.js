//=require ./j4a_view

App.Views.AppBody = Backbone.View.extend({
  el: "#app-body",

  initialize: function() {
    _.bindAll(this, "handleError");
    this.listenTo(App.dispatcher, "ajaxError", this.handleError);
  },

  handleError: function(model, error) {
    console.log('error=>', model, error);
    App.Views.J4AView.prototype.notifyError.apply(this, error);
  },

  onClose: function() {
    this.stopListening();
  },
});
