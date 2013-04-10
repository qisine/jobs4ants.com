window.JST = {};
window.JST.offeredAds = 
  "<div id='indexOfferedAds'>" +
  "<% for(var i=0; i < wa.c.length; i++) { %>" +
    "<div><%= wa.c[i].get('title') %></div>" +
  "<% } %>" +
  "</div>";
