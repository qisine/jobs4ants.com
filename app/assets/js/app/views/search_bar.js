App.Views.SearchBar = Backbone.View.extend({
  type: "searchBar",
  tmpl: JST["js/app/templates/shared/search_bar"],
  el: "#searchBar",

  initialize: function() {
  },

  render: function() {
    this.$el.append(this.tmpl());
  },

  onClose: function() {
  }
});
