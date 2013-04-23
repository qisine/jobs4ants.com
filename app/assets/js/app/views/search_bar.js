App.Views.SearchBar = Backbone.View.extend({
  type: "searchBar",
  tmpl: JST["js/app/templates/shared/search_bar"],
  tagName: "div",
  events: {
    "click button": "search",
  },

  initialize: function() {
    _.bindAll(this, "updateValue");
    this.kwds = this.options.kwds;
    if(this.kwds) this.updateValue(this.kwds);
    this.listenTo(App.dispatcher, "kwds:change", this.updateValue);
  },

  search: function(ev) {
    ev.preventDefault();
    var kwds = this.$el.find("#general-kwds").val();
    this.trigger("search:submit", {kwds: kwds, page: 1});
  },

  updateValue: function(value) {
    this.$el.find("input[type='search']").val(value);
  },

  render: function() {
    this.$el.html(this.tmpl({kwds: this.kwds}));
    return this;
  },
});
