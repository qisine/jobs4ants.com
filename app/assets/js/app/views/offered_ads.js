//= require ./paginator

App.Views.OfferedAds = Backbone.View.extend({
  type: "indexOfferedAds",
  tmpl: JST["js/app/templates/offered_ads/index"],
  el: "#ads-body",

  initialize: function() {
    _.bindAll(this, "render", "parseOptions");
    this.data = this.parseOptions(this.options);
    var self = this;

    App.dispatcher.on("search:submit filter:submit", function(params) {
      _.extend(self.data, self.parseOptions(params));
      self.fetchCollection();
    });

    this.fetchCollection(this.options.kwds, this.options.page);
  },

  fetchCollection: function() {
    console.log(this.data);
    var c = this.collection = new App.Collections.OfferedAds(_.clone(this.data));
    var self = this;
    c.on("paginate:success", function(data) {
      App.dispatcher.trigger("reroute", _.clone(data));
      self.render();
    });
    c.on("paginate:error", function(error) {
      console.log("error!", error);
      App.dispatcher.trigger("error:load", error);
    });
    c.fetch({
      data: _.clone(this.data),
      success: function(resp, status, xhr) {
        App.dispatcher.trigger("reroute", _.clone(self.data));
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

  parseOptions: function(opts) {
    var d = opts || {};
    if(opts) {
      d["cats"] = _.clone(opts.cats);
      d["kwds"] = $.trim(opts.kwds);
      d["page"] = parseInt(opts.page, 10) || 1;
    }
    return d;
  },
});
