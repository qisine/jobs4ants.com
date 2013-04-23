App.Views.DeleteOfferedAd = App.Views.J4AView.extend({
  type: "deleteOfferedAd",
  tmpl: JST["js/app/templates/offered_ads/delete"],
  events: {
    'click .btn-primary': 'handleConfirm',
  },

  initialize: function() {
    this.model = this.options.model;
  },

  handleConfirm: function(ev) {
    ev.preventDefault();

    var self = this;
    this.model.destroy({
      success: function(model, response) {
        var message = "好啊！你的帖子已被删除。。。";
        self.$el.prepend(new App.Views.Notification({message: message, level: "success"}).render().$el);
        self.$el.find(".btn").attr("disabled", "disabled");
      },
    });
  },

  render: function() {
    this.$el.html(this.tmpl({model: this.model}));
    return this;
  },

  onClose: function() {
  }
});
