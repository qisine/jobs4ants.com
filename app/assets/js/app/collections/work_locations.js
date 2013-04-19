//= require ../models/work_location

App.Collections.WorkLocations = Backbone.Collection.extend({
  model: App.Models.WorkLocation,
  url: '/d/work-locations/ac',

  initialize: function() {
  },
});
//App.Collections.WorkLocations.cache = new App.Cache;
