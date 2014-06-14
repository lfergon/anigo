Meteor.startup(function () {
  Log.error("The server is up and running");
  if(Incidents.find().fetch().length===0){
    Log.error("New information avalaible on database");
    var incidents = [
      {status: "Closed", delegation: "scheduled", commentHistory: ["Open ticket", "Data loaded"], priority: "high"},
      {status: "Open", delegation: "scheduled", commentHistory: ["Open ticket", "Data loaded"], priority: "low"},
    ];
    var buildings = [
      {createdAt: moment().valueOf(), contact: "Luis Fernandez", email: "", phone: "", lat: , lng: , temperature: [24, 21, 45, 18, 20, 23, 26], high: 20, area: 200, , description: "Corrupted read", incident: ""}, 
      {createdAt: moment().valueOf(), building: "", contact: "David Grajal", lat: , lng: , temperature:[24, 21, 45, 44, 45, 23, 26], high: 20, priority: "low", description: "No data", incident: ""},
      {createdAt: moment().valueOf(), building: "", contact: "Julie Strd", lat: , lng: , temperature:[24, 21, 45, 18, 20, 23, 26], high: 20, priority: "medium", description: "Corrupted read", incident: ""},
      {createdAt: moment().valueOf(), building: "", contact: "", lat: , lng: , temperature:[24, 21, 45, 18, 20, 23, 26], high: 20, priority: "low", description: "Corrupted read", incident: ""},
      {createdAt: moment().valueOf(), building: "", contact: "Luis Fernandez", lat: , lng: , temperature:[24, 21, 45, 18, 20, 23, 26], high: 20, priority: "high", description: "Corrupted read", incident: ""},
      {createdAt: moment().valueOf(), building: "", contact: "Luis Fernandez", lat: , lng: , temperature:[24, 21, 45, 18, 20, 23, 26], high: 20, priority: "high", description: "Corrupted read", incident: ""},
      {createdAt: moment().valueOf(), building: "", contact: "Luis Fernandez", lat: , lng: , temperature:[24, 21, 45, 18, 20, 23, 26], high: 20, priority: "high", description: "Corrupted read", incident: ""},
      {createdAt: moment().valueOf(), building: "", contact: "Luis Fernandez", lat: , lng: , temperature:[24, 21, 45, 18, 20, 23, 26], high: 20, priority: "high", description: "Corrupted read", incident: ""},
      {createdAt: moment().valueOf(), building: "", contact: "Luis Fernandez", lat: , lng: , temperature:[24, 21, 45, 18, 20, 23, 26], high: 20, priority: "high", description: "Corrupted read", incident: ""},
      {createdAt: moment().valueOf(), building: "", contact: "Luis Fernandez", lat: , lng: , temperature:[24, 21, 45, 18, 20, 23, 26], high: 20, priority: "high", description: "Corrupted read", incident: ""},
    ];
    
  }
});

