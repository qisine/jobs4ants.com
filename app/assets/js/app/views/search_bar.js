App.Views.SearchBar = Backbone.View.extend({
  type: "searchBar",
  tmpl: JST["js/app/templates/shared/search_bar"],
  el: "#search-bar",
  events: {
    "click button": "search",
  },

  initialize: function() {
    _.bindAll(this, "updateValue");
    App.dispatcher.on("kwds:change", this.updateValue);
  },

  search: function(ev) {
    ev.preventDefault();
    var kwds = this.$el.find("#general-kwds").val();

    App.dispatcher.trigger("search:submit", {kwds: kwds, page: 1});
  },

  updateValue: function(value) {
    this.$el.find("input[type='search']").val(value);
  },

  render: function() {
    this.$el.html(this.tmpl());
  },

  onClose: function() {
    this.undelegateEvents();
  }
});
