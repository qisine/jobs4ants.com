App.Views.JobCategories = Backbone.View.extend({
  type: "jobCategories",
  tmpl: JST["js/app/templates/shared/job_categories"],
  el: "#job-categories",
  events: {
    "click button": "filter",
  },

  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, "render");
    if(!this.collection) {
       this.collection = new App.Collections.JobCategories;
       this.fetchCollection();
    }
  },

  fetchCollection: function() {
    var c = this.collection;
    c.on("reset", this.render);
    c.fetch({
      success: function(resp, status, xhr) { /*App.dispatcher.trigger("");*/ },
      error: function(error) {
        console.log("error!", error);
        App.viewManager.add(new App.Views.Notification({message: "囧，错误！", level: "error"})).render();
      },
      reset: true,
    });
  },

  filter: function(ev) {
    ev.preventDefault();

    var selected = this.$el.find("input:checked").map(function() { return this.value });

    App.dispatcher.trigger("filter:submit", { cats: $.makeArray(selected) });
  },

  render: function() {
    this.$el.html(this.tmpl({models: this.collection.models}));
  },

  onClose: function() {
    this.undelegateEvents();
  }
});
