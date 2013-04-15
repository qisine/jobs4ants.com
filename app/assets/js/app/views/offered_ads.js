//= require ./paginator

App.Views.OfferedAds = Backbone.View.extend({
  type: "indexOfferedAds",
  tmpl: JST["js/app/templates/offered_ads/index"],
  el: "#ads-body",

  initialize: function() {
    _.bindAll(this, "render", "_addOptions");
    this._addOptions(this.options);
    var self = this;

    App.dispatcher.on("search:submit", function(params) {
      self._addOptions(params);
      self.fetchCollection();
    });
    App.dispatcher.on("filter:submit", function(params) {
      self._addOptions(params);
      self.fetchCollection();
    });

    if(!this.options.collection) {
      this.fetchCollection(this.options.kwds, this.options.page);
    } else {
      this.collection = this.options.collection;
      this.collection.on("reset", this.render);
    }
  },

  fetchCollection: function() {
    var data = { page: this.page , kwds: this.kwds, cats: this.cats};
    var c = this.collection = new App.Collections.OfferedAds;
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
  },

  _addOptions: function(opts) {
    _.extend(this, opts);
    if(this.kwds) this.kwds = $.trim(this.kwds);
    if(this.page) this.page = parseInt(this.options.page, 10) || 1;
  },
});
