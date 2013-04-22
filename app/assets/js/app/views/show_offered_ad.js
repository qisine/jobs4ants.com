App.Views.ShowOfferedAd = App.Views.J4AView.extend({
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
      this.render();
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
    });
  },

  render: function() {
    this.$el.html(this.tmpl({model: this.model }));
    this.vwSearchBar = new App.Views.SearchBar({resetCats: true}).render();
    this.$el.prepend(this.vwSearchBar.$el);
    return this;
  },

  onClose: function() {
    this.vwSearchBar && this.vwSearchBar.close();
  },
});
