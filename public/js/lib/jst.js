window.JST = {};
window.JST.offeredAds = _.template(
  "<div id='indexOfferedAds'>" +
  "<% _.each(collection, function(ad) { %>" +
    "<div class='ad'>" +
      "<div><%= ad.name %></div>" +
    "</div>" +
  "<% }) %>" +
  "</div>"
);
