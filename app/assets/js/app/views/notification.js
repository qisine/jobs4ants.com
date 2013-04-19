App.Views.Notification = Backbone.View.extend({
  type: "Notification",
  tmpl: JST["js/app/templates/shared/notification"],
  tagName: "div",
  events: {
    "click a.dismissor" : "dismiss",
  },

  initialize: function() {
    _.bindAll(this, "dismiss");
    this.message = this.options.message;
    this.level = this.options.level;
  },

  dismiss: function(ev) { 
    ev.preventDefault();
    this.close();
    this.$el.children().remove();
  },

  render: function() {
    var m = this.message;
    if(m && m.join) { 
      m = _.map(m, function(e) { return App.htmlEscape(e) });
      m = "<ul><li>" + m.join("<li>") + "</ul>";
      m = $("<div/>").text(m).html();
    } else if(m) {
      m = App.htmlEscape(m);
    }
    this.message = m;
    this.$el.html(this.tmpl({message: m, level: this.level}));
    return this;
  },

  onClose: function() {
  }
});
