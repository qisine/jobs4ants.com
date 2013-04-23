//=require ../view_collection

App.Views.AppBody = App.Views.J4AView.extend({
  el: "#app-body",
  type: "AppBody",

  home: function() {
    this.$el.html(this.subviews.add(new App.Views.Home).render().el)
  },

  offeredAds: function(params) {
    App.dispatcher.trigger("kwds:change", $.trim(params.kwds));
    App.dispatcher.trigger("cats:change", params.cats);
    var c = new App.Collections.OfferedAds;
    var v = new App.Views.OfferedAds({collection: c, data: params});
    this.$el.html(this.subviews.add(v).el);
  },

  showOfferedAd: function(id) {
    var v = new App.Views.ShowOfferedAd({model: App.Models.OfferedAd.create({id: id })});
    this.$el.html(this.subviews.add(v).el);
  },

  newOfferedAd: function() {
    var v = new App.Views.NewOfferedAd({model: App.Models.OfferedAd.create()});
    this.$el.html(this.subviews.add(v).el);
  },

  editOfferedAd: function(id) {
    var v = new App.Views.EditOfferedAd({model: App.Models.OfferedAd.create({id: id})});
    this.$el.html(this.subviews.add(v).el);
  },
  
  publishOfferedAd: function(id) {
    var v = new App.Views.PublishOfferedAd({model: App.Models.OfferedAd.create({id: id})});
    this.$el.html(this.subviews.add(v).el);
  },

  deleteOfferedAd: function(id) {
    var v = new App.Views.DeleteOfferedAd({model: App.Models.OfferedAd.create({id: id})});
    this.$el.html(this.subviews.add(v).el);
  },
});
