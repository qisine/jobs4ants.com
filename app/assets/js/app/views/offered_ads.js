//= require ./paginator

App.Views.OfferedAds = Backbone.View.extend({
  type: "indexOfferedAds",
  tmpl: JST["js/app/templates/offered_ads/index"],
  el: "#ads-body",

  initialize: function() {
    _.bindAll(this, "render");
    this.kwds = $.trim(this.options.kwds);
    this.page = parseInt(this.options.page, 10) || 1;

    if(!this.options.collection) {
      this.fetchCollection(this.options.kwds, this.options.page);
    } else {
      this.collection = this.options.collection;
      this.collection.on("reset", this.render);
    }
  },

  fetchCollection: function() {
    var data = { page: this.page };
    if(this.kwds) data["kwds"] = this.kwds;
    this.collection = c = new App.Collections.OfferedAds;
    c.on("reset", this.render);
    c.fetch({
      data: data,
      success: function(resp, status, xhr) {
        App.dispatcher.trigger("offeredAds:search:success", data);
      },
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
