//= require ./view_manager

App.errorHandler = (function(viewManager) {
  var ErrorHandler = function() {
    _.bindAll(this, "handle"); 
    this.vM = viewManager;
  }

  ErrorHandler.prototype.errorMessages = {
    401: "授权没通过",
    404: "找不到这个东东 :(",
    default: "呃，系统出错。。。不好意思！",
  }

  ErrorHandler.prototype.handle = function(ev, jqxhr, settings, exception) {
    console.log("error =>", settings);
    var v = viewManager.currentView(), s = settings;
    if(v.handleError) 
      v.handleError(this.errorMessages[settings.status || "default"]);
    else
      this.defaultHandler(s.statusText);
  }

  ErrorHandler.prototype.defaultHandler = function(errorText) {
    $("<div>" + App.htmlEscape(errorText) + "</div>")
      .addClass("alert alert-error")
      .addClass("toast")
      .appendTo("body")
      .fadeOut(1000);
  }

  return new ErrorHandler;
})(App.viewManager);

$(document).ajaxError(App.errorHandler.handle);
