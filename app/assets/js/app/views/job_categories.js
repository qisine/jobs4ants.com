App.Views.JobCategories = Backbone.View.extend({
  type: "jobCategories",
  tmpl: JST["js/app/templates/shared/job_categories"],
  tag: "div",
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
      reset: true,
    });
  },

  filter: function(ev) {
    ev.preventDefault();

    var selected = this.$el.find("input:checked").map(function() { return this.value });

    App.dispatcher.trigger("filter:submit", { cats: $.makeArray(selected), page: 1 });
  },

  render: function() {
    this.$el.html(this.tmpl({models: this.collection.models}))
    var self = this;
    if(this.cats && this.cats.length > 0) {
      this.$el
        .find("input[type='checkbox']")
        .each(function() {
          if(_.contains(self.cats, this.value)) $(this).attr("checked", "");
        });
    }
    return this;
  },

  onClose: function() {
    this.undelegateEvents();
  }
});
