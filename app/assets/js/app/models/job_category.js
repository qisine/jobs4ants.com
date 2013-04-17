App.Models.JobCategory = Backbone.Model.extend({
  url: function() {
    base = '/d/job-categories'
    if(this.isNew()) return base; 
    return base + '/' + this.id;
  }
});
