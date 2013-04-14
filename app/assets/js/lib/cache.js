window.App.Cache = (function() {
  function Cache() {
    this.c = {}; 
  }

  Cache.prototype.add = function(obj) {
    c[obj.id] = obj;
    return obj;
  }

  Cache.prototype.addAll = function(arr) {
    for(var i = 0;i < arr.length;i++) this.add(arr[i]);
  }

  Cache.prototype.remove = function(obj) {
    if(c[obj.id]) delete c[obj.id];
  }

  Cache.prototype.get = function(obj) {
    return c[obj.id];
  }

  Cache.prototype.getAll = function() {
    _.values(c);
  }

  Cache.prototype.size = function() { 
    Object.keys(c).length
  }

  return Cache;
})();
