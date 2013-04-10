window.App = window.App || { Collections: {}, Models: {}, Routers: {}, Views: {}, };
App.Models.OfferedAd = Backbone.Model.extend({
  url: function() {
    base = 'd/offered_ads'
    if(this.isNew()) return base; 
    return base + '/' + this.id;
  }
});
