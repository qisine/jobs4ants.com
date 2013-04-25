App.Views.Footer = Backbone.View.extend({
  type: "Footer",
  tmpl: JST["js/app/templates/shared/footer"],
  el: "footer",

  initialize: function() {
    _.bindAll(this, "render");
    Backbone.history.on("route", this.render);
  },

  render: function() {
    this.$el.html(this.tmpl());
    return this;
  },
});
