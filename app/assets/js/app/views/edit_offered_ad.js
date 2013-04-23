//= require ./new_edit_base_ad

App.Views.EditOfferedAd = App.Views.NewEditBaseAd.extend({
  type: "editOfferedAd",

  initialize: function() {
    _.bindAll(this, "handleSuccess");
    App.Views.NewEditBaseAd.prototype.initialize.apply(this, arguments); 
  },

  handleSuccess: function(model, response) {
    console.log('ad successfully updated!');
    App.dispatcher.trigger("offered_ad:edited", model.id);
  },
 
  render: function() {
    App.Views.NewEditBaseAd.prototype.render.apply(this, arguments);
    var ad = this.model;
    var el = this.$el;
    _.each(ad.attributes, function(v, k) {
      if(k == "job_category") 
        el.find("[name='job_category_id']").val(v.get('id'));
      else if (k == "work_location")
        el.find("[name='work_location_zip']").val(v.get('zip'));
      else if(!_.contains(["sqc", "url"], k))
        el.find("[name='" + k + "']").val(v);
    }, this);
    return this;
  },
});
