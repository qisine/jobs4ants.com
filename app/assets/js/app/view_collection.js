window.App.ViewCollection = (function(Backbone, $, _) {
  views = {};

  ViewCollection = function() { }

  ViewCollection.prototype.add = function(newViewInst) {
    oldViewInst = views[newViewInst.type];
    if(oldViewInst)
      oldViewInst.close();

    return newViewInst;
  }

  ViewCollection.prototype.get = function(type) {
    return views[type];
  }

  ViewCollection.prototype.closeAll = function() {
    _.each(views, close);
  }

  return ViewCollection;
})(Backbone, $, _);
