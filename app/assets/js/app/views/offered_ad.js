App.Views.ShowOfferedAd = Backbone.View.extend({
  type: "showOfferedAd",
  tmpl: JST["js/app/templates/offered_ads/show"],
  el: "#app-body",

  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, "render");
    if(this.modelId) this.fetchModel();
  },

  fetchModel: function() {
    var m = this.model = App.Models.OfferedAd.create({id: this.modelId});
    console.log(m);
    if(m.fromCache) {
      this.render();
      return;
    }
    var self = this;
    m.fetch({
      success: function(resp, status, xhr) {
        //App.dispatcher.trigger("reroute", {modelId: self.modelId});
        self.render();
      },
      error: function(error) {
        console.log("error!", error);
        App.dispatcher.trigger("error:load", error);
      },
    });
  },

  render: function() {
    this.$el.html(this.tmpl({model: this.model }));
    return this;
  },

  onClose: function() {
  },
});
