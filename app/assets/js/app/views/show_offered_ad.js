App.Views.ShowOfferedAd = App.Views.J4AView.extend({
  type: "showOfferedAd",
  tmpl: JST["js/app/templates/offered_ads/show"],

  initialize: function() {
    _.bindAll(this, "render");
    App.Views.J4AView.prototype.initialize.apply(this);

    this.listenTo(this.model, "change", this.render);
    this.model.fetch();
  },

  render: function() {
    this.$el.html(this.tmpl({model: this.model }));
    var v = this.subviews.add(new App.Views.SearchBar).render();
    this.listenTo(v, "search:submit", function(data) {
      App.dispatcher.trigger("search:submit", data);
    }),
    this.$el.prepend(v.el);
    return this;
  },
});
