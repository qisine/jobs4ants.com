App.Views.Home = App.Views.J4AView.extend({
  type: "home",
  tmpl: JST["js/app/templates/home/index"],
  events: {
    "click #home button": "search",
  },

  initialize: function() {
    _.bindAll(this, "render");
  },

  search: function(ev) {
    ev.preventDefault();
    var kwds = this.$el.find("#general-kwds").val();

    App.dispatcher.trigger("home:search:submit", { kwds: kwds });
  },

  render: function() {
    this.$el.html(this.tmpl());
    return this;
  },

  onClose: function() {
  },
});
