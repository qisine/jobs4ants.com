App.Views.DeleteOfferedAd = App.Views.J4AView.extend({
  type: "deleteOfferedAd",
  tmpl: JST["js/app/templates/offered_ads/delete"],
  events: {
    'click .btn-primary': 'handleConfirm',
  },

  initialize: function() {
    this.model.fetch().done(this.render);
    App.Views.J4AView.prototype.initialize.apply(this);
    _.bindAll(this, "render");
    this.model.fetch({
      success: this.render,
      error: this.handleError,
    });
  },

  handleConfirm: function(ev) {
    ev.preventDefault();

    var self = this;
    this.model.destroy({
      success: function(model, response) {
        var message = TR('delete.confirm');
        self.$el.prepend(new App.Views.Notification({message: message, level: "success"}).render().$el);
        self.$el.find(".btn").attr("disabled", "disabled");
      },
    });
  },

  render: function() {
    this.$el.html(this.tmpl({model: this.model}));
    return this;
  },
});
