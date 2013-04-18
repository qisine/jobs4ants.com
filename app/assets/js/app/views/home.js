App.Views.Home = Backbone.View.extend({
  type: "home",
  tmpl: JST["js/app/templates/home/index"],
  el: "#app-body",
  events: {
    "click button": "search",
  },

  initialize: function() {
    _.bindAll(this, "render");
  },

  search: function(ev) {
    ev.preventDefault();
    var kwds = this.$el.find("#general-kwds").val();

    App.dispatcher.trigger("home:search:submit", kwds);
  },

  render: function() {
    this.$el.html(this.tmpl());
    return this;
  },

  onClose: function() {
  },
});
