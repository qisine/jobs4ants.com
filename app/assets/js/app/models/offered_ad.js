App.Models.OfferedAd = Backbone.Model.extend({
  previewLength: 150,
  translations: {
    "email": "邮箱",
    "company": "公司",
    "job_category": "行业",
    "work_location_zip": "工作低点",
    "title": "标题",
    "body": "内容",
    "job_category_id": "行业",
    "sqc": "安全问题",
  },

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

  validate: function(attrs, opts) {
    var a = attrs, self = this, errors = [];
    _.each(["company", "job_category_id", "title", "body"], function(e) {
      if(!a[e] && (e !== "email" || !this.isNew())) errors.push(self.translations[e] + "不能为空");
    });
    if(attrs.email && !App.emailRegexp.exec(attrs.email.toUpperCase()))
      errors.push(this.translations.email + "不是正确的邮箱地址");

    if(errors.length > 0) return errors;
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
