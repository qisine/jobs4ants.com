//= require ./app/init
//= require ./lib/underscore
//= require ./lib/backbone
//= require ./lib/view_manager
//= require_tree ./app/templates
//= require_tree ./app

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

App.init();
