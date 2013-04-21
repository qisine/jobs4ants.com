window.App.viewManager = (function() {
  function ViewManager() {
    this.views = {};
  }

  ViewManager.prototype.add = function(newViewInst) {
    oldViewInst = this.views[newViewInst.type];
    if(oldViewInst)
      oldViewInst.close();

    this.currentView = this.views[newViewInst.type] = newViewInst;
    return newViewInst;
  },

  ViewManager.prototype.currentView = function() {
    return this._currentView;
  },

  return new ViewManager();
})();


