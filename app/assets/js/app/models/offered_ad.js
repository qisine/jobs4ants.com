App.Models.OfferedAd = Backbone.Model.extend({
  previewLength: 150,

  constructor: function(attributes, options) {
    if(attributes && attributes.id) {
      App.Models.OfferedAd.cache.add(this);
    }
    Backbone.Model.apply(this, arguments);
  },

  parse: function(response) {
    response.work_location = new App.Models.WorkLocation(response.work_location);
    response.job_category = new App.Models.JobCategory(response.job_category);
    return response;
  },

  url: function() {
    base = '/d/offered-ads'
    if(this.isNew()) return base; 
    return base + '/' + this.id;
  },

  bodyPreview: function() {
    var b = this.get('body');
    if(!this._bodyPreviewString && b && b.length > this.previewLength) 
      this._bodyPreviewString = b.substr(0, this.previewLength) + "...";

    return this._bodyPreviewString || b;
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
