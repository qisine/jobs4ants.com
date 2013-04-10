_.extend(window.App, {
  init: function() {
    new App.Routers.AppRouter;
    Backbone.history.start();
  },
  dispatcher: _.extend({}, Backbone.Events),
});

Backbone.View.prototype.close = function() {
  this.remove();
  this.off();

  this.onClose && this.onClose();
}

//_.templateSettings.variable = "wa";

App.init();
