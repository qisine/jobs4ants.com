App.Views.Header = Backbone.View.extend({
  type: "Header",
  tmpl: JST["js/app/templates/shared/header"],
  el: "header",
  events: {
    "click #lang-nav a": "changeLocale"
  },

  initialize: function() {
    _.bindAll(this, "render");
  },

  changeLocale: function(ev) {
    ev.preventDefault();
    var newLocale = $.trim(ev.target.text);

    App.dispatcher.trigger("locale:changed", newLocale);
  },

  render: function() {
    this.$el.html(this.tmpl({currentPath: this.currentPath}));
    return this;
  },
});
