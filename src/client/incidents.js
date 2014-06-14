Template.incidents.events({
 'click input': function () {
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  }
});

Template.incidents.rendered = function () {
  var mapContainer = document.getElementById("map");
  console.log($("#map"));
  
  // Create a map inside the map container DOM node
  var map = new nokia.maps.map.Display(mapContainer, {
    // initial center and zoom level of the map
    center: [52.51, 13.4],
    zoomLevel: 10,
    components:[new nokia.maps.map.component.Behavior()]
  });
  var standardMarker = new nokia.maps.map.StandardMarker(map.center);
  map.objects.add(standardMarker);
};

Template.incidents.changeMap = function () {
  Meteor.defer(function() {
    $($("#map").children()[0]).css("position", "absolute");
  });
};
