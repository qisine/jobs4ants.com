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
    var c = this.collection = this.options.collection;
    c.on("reset", this.render);

    var self = this;
    this.listenTo(this.collection, "error", function(model, error) {
      self.trigger("error", model, error);
    });

    c.fetch({reset: true});
  },

  filter: function(ev) {
    ev.preventDefault();

    var selected = this.$el.find("input:checked").map(function() { return this.value });
    this.trigger("filter:submit", { cats: $.makeArray(selected), page: 1 });
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
