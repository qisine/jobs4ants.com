//= require ./app/init
//= require ./lib/underscore
//= require ./lib/jquery-1.9.1
//= require ./lib/backbone
//= require ./lib/view_manager
//= require ./lib/cache.js
//= require_tree ./app/templates
//= require_tree ./app

_.extend(window.App, {
  init: function() {
    $(function() {
      new App.Routers.AppRouter;
      Backbone.history.start();
    });
  },
  dispatcher: _.extend({}, Backbone.Events),
});

Backbone.View.prototype.close = function() {
  $(this).children().remove();
  this.off();
  this.onClose && this.onClose();
}

App.init();
