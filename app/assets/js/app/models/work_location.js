App.Models.WorkLocation = Backbone.Model.extend({
  url: function() {
    base = '/d/work-locations'
    if(this.isNew()) return base; 
    return base + '/' + this.id;
  }
});
