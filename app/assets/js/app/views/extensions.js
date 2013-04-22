_.extend(Backbone.View.prototype, {
  close: function() {
    this.onClose && this.onClose();
    this.$el.off();
    this.undelegateEvents();
    this.remove();
  },
});
