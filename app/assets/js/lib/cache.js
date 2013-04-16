window.App.Cache = (function() {
  var Cache = function() {
    this.c = {}; 
  }

  Cache.prototype.add = function(obj) {
    this.c[obj.id] = obj;
    return obj;
  }

  Cache.prototype.addAll = function(arr) {
    for(var i = 0;i < arr.length;i++) this.add(arr[i]);
  }

  Cache.prototype.remove = function(obj) {
    if(this.c[obj.id]) delete this.c[obj.id];
  }

  Cache.prototype.get = function(obj) {
    return this.c[obj.id];
  }

  Cache.prototype.getAll = function() {
    _.values(this.c);
  }

  Cache.prototype.size = function() { 
    Object.keys(this.c).length
  }

  return Cache;
})();
