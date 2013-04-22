//= require ./new_edit_base_ad

App.Views.NewOfferedAd = App.Views.NewEditBaseAd.extend({
  type: "newOfferedAd",

  initialize: function() {
    _.bindAll(this, "handleSuccess");
    App.Views.NewEditBaseAd.prototype.initialize.apply(this, arguments); 
  },

  handleSuccess: function(model, response) {
    console.log('ad successfully created!');
    var msg =   "谢谢！我们已把确认邮件发到"
                + "[" + model.get('email') + "]"
                + "。请尽快登录你的邮箱，按照里面的指示完成发布你的帖子"
    this.resetFields();
    this.notifySuccess(msg);
  },
});
