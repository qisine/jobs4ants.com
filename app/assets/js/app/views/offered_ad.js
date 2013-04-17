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
    if(m.fromCache) {
      //this.render();
      console.log('cached model=>', this.model);
      return;
    }
    var self = this;
    m.on("change", this.render);
    m.fetch({
      success: function(resp, status, xhr) {
        //App.dispatcher.trigger("reroute", {modelId: self.modelId});
        console.log('fetched model=>', self.model);
        //self.render();
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
