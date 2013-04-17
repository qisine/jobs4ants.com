//= require ../collections/offered_ads

App.Views.Paginator = Backbone.View.extend({
  type: "paginator",
  tmpl: JST["js/app/templates/shared/paginator"],
  events: {
    "click a#p-next": "next",
    "click a#p-previous": "previous",
    "change select#p-selection": "goTo",
  },
  tagName: "div",

  initialize: function() {
    _.bindAll(this, "next", "previous", "goTo", "render");
    this.collection = (this.options.collection || new App.Collections.OfferedAds);
  },

  render: function() {
    var t = this.tmpl({ info: this.collection.pageInfo() });
    this.$el.append(t);
    return this;
  },
    
  goTo: function(ev) {
    ev.preventDefault();
    var value = parseInt($(ev.target).val(), 10);
    this.collection.goTo(value || -1);
  },

  next: function(ev) {
    this.collection.nextPage();
    return false;
  },

  previous: function(ev) {
    this.collection.previousPage();
    return false;
  },

  onClose: function() {
    this.undelegateEvents();
    this.collection.off;
    this.off();
    this.remove();
  },
});
