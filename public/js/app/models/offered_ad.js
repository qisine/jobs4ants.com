window.App = window.App || { Collections: {}, Models: {}, Routers: {}, Views: {}, };
App.Models.OfferedAd = Backbone.Model.extend({
  url: function() {
    base = 'http//0.0.0.0:3000/public/offered_ads'
    if(this.isNew()) return base; 
    return base + '/' + this.id;
  }
});
