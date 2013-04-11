//= require ./paginator

App.Views.OfferedAds = Backbone.View.extend({
  type: "indexOfferedAds",
  tmpl: JST["js/app/templates/offered_ads/index"],
  el: "#app-body",

  initialize: function() {
    _.bindAll(this, "render");
    if(!this.options.collection) {
      this.fetchCollection(this.options.kwds);
    } else {
      this.collection = this.options.collection;
      this.collection.on("reset", this.render);
    }
  },

  fetchCollection: function(kwds) {
    var data = {};
    if(kwds = $.trim(kwds)) data["kwds"] = kwds;
    this.collection = c = new App.Collections.OfferedAds;
    c.on("reset", this.render);
    c.fetch({
      data: data,
      success: function(resp, status, xhr) { },
      error: function(error) {
        console.log("error!", error);
        App.viewManager.add(new App.Views.Notification({message: "囧，错误！", level: "error"})).render();
      },
    });
  },

  render: function() {
    this.$el.html(this.tmpl({models: this.collection.models }));
    this.paginator = new App.Views.Paginator({collection: this.collection});
    this.$el.append(this.paginator.render());
    return this;
  },

  onClose: function() {
    this.collection.off;
    this.paginator.close();
  }
});
