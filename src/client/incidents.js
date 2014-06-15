Template.incidents.events({
  'click .createIncident': function (event) {
    Log.warn("Creating new incident");
    var buildings = Buildings.find({}).fetch();
    var incidents = [];
    buildings.forEach(function (build, index) {
      if(index===1){
        incidents.push({position:1, building: build._id, createdAt: moment().valueOf(), status: "In progress", delegation: "scheduled", commentHistory: [{comment: "Closed ticket", createdAt: moment.valueOf()}], priority: "low"});
      }
      if(index===2){
        incidents.push({position: 2, building: build._id, createdAt: moment().valueOf(), status: "Open", delegation: "scheduled", commentHistory: [{comment: "Closed ticket", createdAt: moment.valueOf()}], priority: "medium"});
      }
      if(index===3){
        incidents.push({position: 3, building: build._id, createdAt: moment().valueOf(), status: "Open", delegation: "scheduled", commentHistory: [{comment: "Closed ticket", createdAt: moment.valueOf()}], priority: "high"});
      }
      if(index===4){
        incidents.push({position: 4, building: build._id, createdAt: moment().valueOf(), status: "Suspended", delegation: "scheduled", commentHistory: [{comment: "Closed ticket", createdAt: moment.valueOf()}], priority: "critical"});
      }
    });
    incidents.forEach(function (incident) {
      Incidents.insert(incident);
    });
  },
  'click .choosenBuilding': function (event) {
    var idBuilding = $(event.target).closest('tr').attr('id');
    var buildingSelected = Buildings.findOne({_id: idBuilding});
    Session.set("building", buildingSelected);
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
        data: buildingSelected.temperature
      }]
    });
  }
});

Session.set("building", undefined);
Template.incidents.showInfoBuilding = function () {
  if(Session.get("building")!==undefined){
    return Session.get("building");
  }else{
    return false;
  }
};

Template.incidents.rendered = function () {
  var mapContainer = document.getElementById("map");
  // Create a map inside the map container DOM node
  var map = new nokia.maps.map.Display(mapContainer, {
    // initial center and zoom level of the map
    center: [52.51, 13.4],
    zoomLevel: 10,
    components:[new nokia.maps.map.component.Behavior(), new nokia.maps.map.component.ZoomBar()]
  });
  // Create an instance of Container to store our markers
  var markersContainer = new nokia.maps.map.Container();
  // Create some markers
  var redMarker = new nokia.maps.map.StandardMarker(
    [52.5056495, 13.3954319],
    { 
      text: 1, 
      brush: { color: "red" }
    }
  ),
  greenMarker = new nokia.maps.map.StandardMarker(
    [52.5058259, 13.3961078],
    { 
      text: 2, 
      brush: { color: "green" }
    }
  ),
  blueMarker = new nokia.maps.map.StandardMarker(
    [52.5059499, 13.3964511],
    { 
      text: 3 
    }
  ),
  orangeMarker = new nokia.maps.map.StandardMarker(
    [52.5060479, 13.3953783],
    { 
      text: 4,
      brush: { color: "orange" }
    }
  );
    
  // We add our newly created markers to a container
  markersContainer.objects.addAll([
    redMarker, 
    greenMarker, 
    blueMarker, 
    orangeMarker
  ]);
  markersContainer.addListener(
    nokia.maps.dom.Page.browser.touch ? "tap" : "click",
    function (evt) {
       this.objects.remove(evt.target);
       this.objects.add(evt.target);
    }
  );

  map.objects.add(markersContainer);
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
  $('#chartLive').highcharts({
    chart: {
      type: 'spline',
      animation: Highcharts.svg, // don't animate in old IE
      marginRight: 10,
      events: {
        load: function() {

          // set up the updating of the chart each second
          var series = this.series[0];
          setInterval(function() {
              var x = (new Date()).getTime(), // current time
                  y = Math.random();
              series.addPoint([x, y], true, true);
          }, 1000);
        }
      }
    },
    title: {
      text: 'Live data'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },
    yAxis: {
      title: {
        text: 'Value'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.series.name +'</b><br/>'+
        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
        Highcharts.numberFormat(this.y, 2);
      }
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{
      name: 'Random data',
      data: (function() {
        // generate an array of random data
        var data = [], time = (new Date()).getTime(), i;
        for (i = -19; i <= 0; i++) {
          data.push({
            x: time + i * 1000,
            y: Math.random()
          });
        }
        return data;
      })()
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
