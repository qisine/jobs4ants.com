Backbone.oldSync = Backbone.sync;

_.extend(Backbone, {
  sync: function(method, model, options) {
    var oldError = options.error;
    options.error = function(model, error) {
      if(!options.noDefaultErrorHandling) App.dispatcher.trigger("ajaxError", model, error);
      if(oldError) oldError(model, error);
    }
    return Backbone.oldSync.apply(this, arguments);
  },
});
