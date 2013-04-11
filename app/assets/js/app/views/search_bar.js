App.Views.SearchBar = Backbone.View.extend({
  type: "searchBar",
  tmpl: JST["js/app/templates/shared/search_bar"],
  el: "#search-bar",
  events: {
    "click input[type=submit]": "search",
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
    this.$el.append(this.tmpl());
  },

  onClose: function() {
  }
});
