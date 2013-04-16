App.Models.OfferedAd = Backbone.Model.extend({
  previewLength: 250,

  constructor: function(attributes, options) {
    if(attributes && attributes.id) {
      App.Models.OfferedAd.cache.add(this);
    }
    Backbone.Model.apply(this, arguments);
  },

  url: function() {
    base = 'd/offered-ads'
    if(this.isNew()) return base; 
    return base + '/' + this.id;
  },

  bodyPreview: function() {
    if(!this._bodyPreviewString && this.body && this.body.length > this.previewLength) 
      this._bodyPreviewString = this.body.substr(0, this.previewLength);

    return this._bodyPreviewString;
  }
});

App.Models.OfferedAd.cache = new App.Cache;
App.Models.OfferedAd.create = function(attrs) {
  var ad;
  if(attrs) {
    ad = this.cache.get(attrs); 
    if(ad) {
      ad.fromCache = true
      return ad;
    }
  }
  ad = this.cache.add(new this(attrs));
  return ad;
}
