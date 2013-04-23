//= require ./lib/jquery-1.9.1
//= require ./lib/bootstrap
//= require ./lib/underscore
//= require_directory ./lib
//= require ./app/init
//= require_tree ./app/templates
//= require_directory ./app
//= require ./app/views/j4a_view
//= require_tree ./app

_.extend(window.App, {
  init: function() {
    $(function() {
      new App.AppRouter;
      Backbone.history.start({pushState: true});
    });
  },
  dispatcher: _.extend({}, Backbone.Events),
  htmlEscape: function(str) { return $("<div/>").text(str).html() },
  emailRegexp: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/,
});

App.init();
