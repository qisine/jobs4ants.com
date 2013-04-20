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
 
  onClose: function() {
    this.undelegateEvents();
    this.autocomplete.off();
  },
});
