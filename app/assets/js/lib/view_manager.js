window.App.viewManager = (function() {
  function ViewManager() {
    this.views = {};
  }

  ViewManager.prototype.add = function(newViewInst) {
    oldViewInst = this.views[newViewInst.type];
    if(oldViewInst)
      oldViewInst.close();

    this.views[newViewInst.type] = newViewInst;
    return newViewInst
  }

  return new ViewManager();
})();


