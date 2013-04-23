App.Views.NewEditBaseAd = App.Views.J4AView.extend({
  tmpl: JST["js/app/templates/offered_ads/new_edit"],
  events: {
    "click .btn-primary": "handleSubmit",
  },

  initialize: function() {
    _.bindAll(this, "render");
    App.Views.J4AView.prototype.initialize.apply(this, arguments);

    var c = this.cats = new App.Collections.JobCategories;
    c.fetch({
      success: this.render,
      error: this.handleError,
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
      this.notifyError("安全问题回答不对！");
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
      this.notifyError(ad.validationError);
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
        self.notifyError("存贴没成功。。。");
      },
      noDefaultErrorHandling: true,
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

  render: function() {
    this.$el.html(this.tmpl({cats: this.cats, type: this.type}));
    var v = this.subviews.add(new App.Views.Autocomplete);
    this.listenTo(v, "error", this.handleError);
    this.$el.find("#job-category").after(v.render().$el);
    return this;
  },
});
