//= require ./paginator

App.Views.OfferedAds = Backbone.View.extend({
  type: "indexOfferedAds",
  tmpl: JST["js/app/templates/offered_ads/index"],
  el: "#ads-body",

  initialize: function() {
    _.bindAll(this, "render", "_addOptions");
    this._addOptions(this.options);
    var self = this;

    App.dispatcher.on("search:submit filter:submit", function(params) {
      self._addOptions(params);
      self.fetchCollection();
    });

    this.fetchCollection(this.options.kwds, this.options.page);
  },

  fetchCollection: function() {
    var data = { page: this.page , kwds: this.kwds, cats: this.cats};
    console.log(data);
    var c = this.collection = new App.Collections.OfferedAds(data);
    var self = this;
    c.on("paginate:success", function(data) {
      _.extend(self, data);
      App.dispatcher.trigger("reroute", data);
      self.render();
    });
    c.on("paginate:error", function(error) {
      console.log("error!", error);
      App.dispatcher.trigger("error:load", error);
    });
    c.fetch({
      data: data,
      success: function(resp, status, xhr) {
        App.dispatcher.trigger("reroute", data);
        self.render();
      },
      error: function(error) {
        console.log("error!", error);
        App.dispatcher.trigger("error:load", error);
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
    if(this.page) this.page = parseInt(this.page, 10) || 1;
  },
});
