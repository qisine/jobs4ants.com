//=require ./notification

_.extend(Backbone.View.prototype, {
  close: function() {
    this.$el.off();
    this.undelegateEvents();
    this.onClose && this.onClose();
    //this.el = this.$el = undefined;
  },

  handleError: function(error) {

  },
});
