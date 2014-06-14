Meteor.startup(function () {
  Log.error("The server is up and running");
  if(Buildings.find().fetch().length===0){
    Log.error("New information avalaible on database");
    var buildings = [
      {createdAt: moment().valueOf(), contact: "Luis Fernandez", email: "lferg@gmail.com", phone: "609029502", lat: 52.5044731, lng: 13.3970743, neighboorhood: "Kreuzberg", temperature: [24, 21, 45, 18, 20, 23, 26], high: 20, area: 200, description: "Corrupted read", incident: ""}, 
      {createdAt: moment().valueOf(), contact: "Julie", email: "julie@gmail.com", phone: "6090555", lat: 52.5496418, lng: 13.3898216, neighboorhood: "Wedding", temperature: [24, 21, 45, 18, 20, 23, 26], high: 20, area: 15, description: "No data", incident: ""}, 
      {createdAt: moment().valueOf(), contact: "Thomas Müller", email: "muller@gmail.com", phone: "65567", lat: 52.4857131, lng: 13.4389168, neighboorhood: "Neukölln", temperature: [24, 21, 45, 18, 20, 23, 26], high: 30, area: 26, description: "Temperature", incident: ""}, 
      {createdAt: moment().valueOf(), contact: "Jamie Oliver", email: "jamie@gmail.com", phone: "60902", lat: 52.5026706, lng: 13.4137684, neighboorhood: "Kreuzberg", temperature: [24, 21, 20, 18, 20, 23, 26], high: 15, area: 22, description: "Corrupted read", incident: ""}, 
      {createdAt: moment().valueOf(), contact: "Pedro Jimenez", email: "jimenez@gmail.com", phone: "6029502", lat: 52.5514424, lng: 13.3837277, neighboorhood: "Wedding", temperature: [30, 30, 45, 18, 20, 23, 26], high: 25, area: 23, description: "No data", incident: ""}, 
      {createdAt: moment().valueOf(), contact: "Ana Wolf", email: "wolf@gmail.com", phone: "609292", lat: 52.489633, lng: 13.4302479, neighboorhood: "Neukölln", temperature: [24, 21, 36, 18, 20, 23, 26], high: 22, area: 20, description: "No data", incident: ""}, 
      {createdAt: moment().valueOf(), contact: "Jhon Doe", email: "doe@gmail.com", phone: "602902", lat: 52.5088876, lng: 13.3970743, neighboorhood: "Kreuzberg", temperature: [24, 33, 34, 18, 20, 23, 26], high: 21, area: 20, description: "Temperature", incident: ""}, 
      {createdAt: moment().valueOf(), contact: "Charlize Theron", email: "theron@gmail.com", phone: "6029502", lat: 52.5019652, lng: 13.4296042, neighboorhood: "Kreuzberg", temperature: [24, 451, 45, 18, 20, 23, 26], high: 19, area: 50, description: "No data", incident: ""}, 
      {createdAt: moment().valueOf(), contact: "Pepe Gotera", email: "gotera@gmail.com", phone: "609502", lat: 52.5492765, lng: 13.3776766, neighboorhood: "Wedding", temperature: [24, 21, 45, 184, 20, 23, 26], high: 32, area: 120, description: "No data", incident: ""}, 
      {createdAt: moment().valueOf(), contact: "Faemino", email: "faemino@gmail.com", phone: "609502", lat: 52.5454924, lng: 13.3700377, neighboorhood: "Wedding", temperature: [12, 12, 12, 12, 20, 23, 26], high: 23, area: 150, description: "Temperature", incident: ""}, 
    ];
    buildings.forEach(function (building) {
      Buildings.insert(building);
    });
  }
});

