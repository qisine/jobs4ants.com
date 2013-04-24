//= require ./new_edit_base_ad

App.Views.NewOfferedAd = App.Views.NewEditBaseAd.extend({
  type: "newOfferedAd",

  initialize: function() {
    _.bindAll(this, "handleSuccess");
    App.Views.NewEditBaseAd.prototype.initialize.apply(this, arguments); 
    this.cats.fetch({
      success: this.render,
      error: this.handleError,
    });
  },

  handleSuccess: function(model, response) {
    console.log('ad successfully created!');
    var msg =   TR('new.confirm.part_one')
                + "[" + model.get('email') + "]"
                + TR('new.confirm.part_two')
    this.resetFields();
    this.notifySuccess(msg);
  },
});
