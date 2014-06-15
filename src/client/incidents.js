Template.incidents.events({
  'click .createIncident': function (event) {
    Log.warn("Creating new incident");
    var buildings = Buildings.find({}).fetch();
    var incidents = [];
    var incid = Incidents.find().fetch().length;
    var issues = ['Fire', 'Temperature', 'No data'];
    buildings.forEach(function (build, index) {
      Session.set("building", Buildings.findOne({_id: build._id}));
      incidents.push({position: (incid-(incid-index))+1, item: "#SolarPanel"+(incid-(incid-index))+1, building: build._id, createdAt: moment().valueOf(), status: "In progress", delegation: "scheduled", issue: issues[Math.floor(Math.random() * issues.length)], commentHistory: [{comment: "Closed ticket", createdAt: moment.valueOf()}], priority: "low"});
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

Template.incidents.showInfoBuilding = function () {
  if(Session.get("building")!==undefined){
    return Session.get("building");
  }else{
    return false;
  }
};

Template.incidents.infoIncident = function () {
  if(Session.get("building")!==undefined){
    var building = Session.get("building")._id;
    var incident = Incidents.findOne({building: building});
    return incident;
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
  $('#mapEurope').highcharts({
    title: {
        text: 'Monthly Average Temperature',
        x: -20 //center
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: {
            text: 'Temperature (°C)'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        valueSuffix: '°C'
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
        name: '2011',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
    }, {
        name: '2012',
        data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
    }, {
        name: '2013',
        data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
    }, {
        name: '2014',
        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
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
      text: 'Live data from Cisco'
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
    credits: {
      enabled: false
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
      name: 'Sensor data at the moment',
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
