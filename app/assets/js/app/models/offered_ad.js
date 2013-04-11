App.Models.OfferedAd = Backbone.Model.extend({
  url: function() {
    base = 'd/offered-ads'
    if(this.isNew()) return base; 
    return base + '/' + this.id;
  }
});
