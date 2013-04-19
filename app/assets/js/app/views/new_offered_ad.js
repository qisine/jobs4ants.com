App.Views.NewOfferedAd = Backbone.View.extend({
  type: "newOfferedAd",
  tmpl: JST["js/app/templates/offered_ads/new"],
  el: "#app-body",
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
    ev.preventDefault();
    var url = $.trim(this.$el.find("#url").val());
    if(url) return;

    var sqc = $.trim(this.$el.find("#sqc").val());
    if(!sqc || sqc.toLowerCase() !== "bern") {
      this.handleError("安全问题回答不对！");
      return;
    }

    var attrs = {};
    this.$el.find("input").each(function() {
      attrs[this.name] = $.trim($(this).val());
    });
    var catId = parseInt(this.$el.find("#job-category :selected").val());
    if(catId && catId > 0) attrs["job_category"] = catId;
    var ad = new App.Models.OfferedAd(attrs);
    var errors = ad.validate();
    if(errors && errors.length > 0) handleError(errors);
    console.log("submitting a valid ad=>", ad);
    ad.save({
      success: function() {
        var msg =   "谢谢！我们已把确认邮件发到<b>"
                    + ad.email
                    + "</b>。请尽快登录你的邮箱，按照里面的指示完成发布你的帖子"
        this.$el.find("#notification").remove();
        this.$el.prepend(new App.Views.Notification({message: msg, level: "success"}).render().$el);
      },
      error: function(error) {
        App.dispatcher.trigger("error:load", error); 
      },
    });
  },

  handleError: function(errors) {
    this.$el.find("#notification").remove();
    this.$el.prepend(new App.Views.Notification({message: errors, level: "error"}).render().$el);
  },

  render: function() {
    this.$el.html(this.tmpl({cats: this.cats}));
    var v = this.autocomplete = new App.Views.Autocomplete;
    this.$el.find("#job-category").after(v.render().$el);
    return this;
  },

  onClose: function() {
    this.undelegateEvents();
    this.autocomplete.off();
  },
});
