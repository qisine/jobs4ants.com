App.Views.SearchBar = Backbone.View.extend({
  type: "searchBar",
  tmpl: JST["js/app/templates/shared/search_bar"],
  el: "#search-bar",
  events: {
    "click button": "search",
  },

  initialize: function() {
  },

  search: function(ev) {
    ev.preventDefault();
    var kwds = this.$el.find("#general-kwds").val();

    App.dispatcher.trigger("search:submit");
    App.viewManager.add(new App.Views.OfferedAds({kwds: kwds}));
  },

  render: function() {
    this.$el.html(this.tmpl());
  },

  onClose: function() {
    this.undelegateEvents();
  }
});
