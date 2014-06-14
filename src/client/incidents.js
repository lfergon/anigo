Template.incidents.events({
 'click input': function () {
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  },
  'click .createIncident': function (event) {
    Log.warn("Creating new incident");
    var buildings = Buildings.find({}).fetch();
    var incidents = [];
    buildings.forEach(function (build, index) {
      if(index===1){
        incidents.push({building: build._id, createdAt: moment().valueOf(), status: "Closed", delegation: "scheduled", commentHistory: [{comment: "Closed ticket", createdAt: moment.valueOf()}], priority: "low"});
      }
      if(index===2){
        incidents.push({building: build._id, createdAt: moment().valueOf(), status: "Open", delegation: "scheduled", commentHistory: [{comment: "Closed ticket", createdAt: moment.valueOf()}], priority: "medium"});
      }
      if(index===3){
        incidents.push({building: build._id, createdAt: moment().valueOf(), status: "Open", delegation: "scheduled", commentHistory: [{comment: "Closed ticket", createdAt: moment.valueOf()}], priority: "high"});
      }
      if(index===4){
        incidents.push({building: build._id, createdAt: moment().valueOf(), status: "Closed", delegation: "scheduled", commentHistory: [{comment: "Closed ticket", createdAt: moment.valueOf()}], priority: "critical"});
      }
    });
    incidents.forEach(function (incident) {
      Incidents.insert(incident);
    })
  }
});

Template.incidents.rendered = function () {
  var mapContainer = document.getElementById("map");
  // Create a map inside the map container DOM node
  var map = new nokia.maps.map.Display(mapContainer, {
    // initial center and zoom level of the map
    center: [52.51, 13.4],
    zoomLevel: 10,
    components:[new nokia.maps.map.component.Behavior(), new nokia.maps.map.component.ZoomBar()]
  });
  /* The positioning manager is only available if the browser used supports
  * W3C geolocation API
  */
  if (nokia.maps.positioning.Manager) {
    var positioning = new nokia.maps.positioning.Manager();
    // Trigger the load of data, after the map emmits the "displayready" event
    map.addListener("displayready", function () {
      // Gets the current position, if available the first given callback function is executed else the second
      positioning.getCurrentPosition(function (position) {
        var coords = position.coords, // we retrieve the longitude/latitude from position
          marker = new nokia.maps.map.StandardMarker(coords), // creates a marker
          /* Create a circle map object  on the  geographical coordinates of
           * provided position with a radius in meters of the accuracy of the position
           */
          accuracyCircle = new nokia.maps.map.Circle(coords, coords.accuracy);
        
        // Add the circle and marker to the map's object collection so they will be rendered onto the map.
        map.objects.addAll([accuracyCircle, marker]);
        /* This method zooms the map to ensure that the bounding box calculated from the size of the circle
         * shape is visible in its entirety in map's viewport. 
         */
        map.zoomTo(accuracyCircle.getBoundingBox(), false, "default");
      }, 
      // Something went wrong we wee unable to retrieve the GPS location
      function (error) {
        var errorMsg = "Location could not be determined: ";
        
        // We determine what caused the error and generate error message
        if (error.code == 1) errorMsg += "PERMISSION_DENIED";
        else if (error.code == 2) errorMsg += "POSITION_UNAVAILABLE";
        else if (error.code == 3) errorMsg += "TIMEOUT";
        else errorMsg += "UNKNOWN_ERROR";
        // Throw an alert with error message
        Log.error(errorMsg);
      });
    });
  }
  $("#dataCharts").highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: true,
      backgroundColor:'rgba(255, 255, 255, 0.1)',
      type: 'column'
    },
    title: {
      text: '',
      color: 'black',
    },
    colors: [
      '#000'
    ],
    xAxis: {
      categories: ['28.05.2014', '29.05.2014', '30.05.2014', '01.06.2014', '02.06.2014', '03.06.2014', '04.06.2014']
    },
    yAxis: {
      min: 0,
      title: false
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{
      name: 'Temperature',
      data: [27, 25, 25, 56, 32, 22, 33]
    }]
  });
};

Template.incidents.changeMap = function () {
  Meteor.defer(function() {
    $($("#map").children()[0]).css("position", "absolute");
  });
};

Template.incidents.incident = function () {
  return Incidents.find({}).fetch();
};