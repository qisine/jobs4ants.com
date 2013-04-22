App.Views.NewEditBaseAd = Backbone.View.extend({
  el: "#app-body",
  tmpl: JST["js/app/templates/offered_ads/new_edit"],
  events: {
    "click .btn-primary": "handleSubmit",
  },

  initialize: function() {
    _.bindAll(this, "render");
    var c = this.cats = new App.Collections.JobCategories;
    c.fetch({
      success: this.render,
      error: function(error) {
        App.dispatcher.trigger("error:load", error);
      },
    });
  },

  handleSubmit: function(ev) {
    var self = this, ad = this.model;
    if(!ad) ad = this.model = App.Models.OfferedAd.create();

    ev.preventDefault();
    var url = $.trim(this.$el.find("#url").val());
    if(url) return;

    var sqc = $.trim(this.$el.find("#sqc").val());
    if(!sqc || sqc.toLowerCase() !== "bern") {
      this.showNotification("error", "安全问题回答不对！");
      return;
    }

    var attrs = {};
    this.$el.find("input,textarea").each(function() {
      attrs[this.name] = $.trim($(this).val());
    });
    var catId = parseInt(this.$el.find("#job-category :selected").val());
    if(catId && catId > 0) attrs.job_category_id = catId;
    ad.set(attrs);
    if(!ad.isValid()) {
      this.showNotification("error", ad.validationError)
      return;
    }

    console.log("submitting a valid ad=>", ad);
    this.toggleEnableCtrls();
    ad.save(null, {
      success: function(model, response) {
        self.toggleEnableCtrls(true);
        self.handleSuccess(model, response);
      },
      error: function(error) {
        self.toggleEnableCtrls(true);
        App.dispatcher.trigger("error:load", error); 
      },
    });
  },

  resetFields: function() {
    this.$el.find("input,textarea,select").val('');
  },

  toggleEnableCtrls: function(enable) {
    var els = this.$el.find("input,textarea,select,.btn");
    if(enable)
      els.removeAttr("disabled");
    else
      els.attr("disabled", "disabled")
  },

  showNotification: function(level, message) {
    this.notification && this.notification.remove();
    var v = this.notification = new App.Views.Notification({message: message, level: level})
    this.$el.prepend(v.render().$el);
  },

  render: function() {
    this.delegateEvents();
    this.$el.html(this.tmpl({cats: this.cats, type: this.type}));
    var v = this.autocomplete = new App.Views.Autocomplete;
    this.$el.find("#job-category").after(v.render().$el);
    return this;
  },

  onClose: function() {
    this.undelegateEvents();
    this.autocomplete.off();
  },
});
