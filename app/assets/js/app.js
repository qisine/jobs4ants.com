//= require ./app/init
//= require ./lib/underscore
//= require ./lib/jquery-1.9.1
//= require ./lib/jquery-ui-1.10.2.custom.js
//= require ./lib/backbone
//= require ./lib/view_manager
//= require ./lib/cache.js
//= require_tree ./app/templates
//= require_tree ./app

_.extend(window.App, {
  init: function() {
    $(function() {
      new App.Routers.AppRouter;
      Backbone.history.start({pushState: true});
    });
  },
  dispatcher: _.extend({}, Backbone.Events),
  htmlEscape: function(str) { return $("<div/>").text(str).html() },
  emailRegexp: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/,
});

Backbone.View.prototype.close = function() {
  this.$el.off();
  this.undelegateEvents();
  this.onClose && this.onClose();
  //this.el = this.$el = undefined;
}

App.init();
