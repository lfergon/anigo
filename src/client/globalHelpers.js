UI.registerHelper('isActive', function (input) {
  if(Router.current() && Router.current().route.name===input){
    return "active";
  }else{
    return "";
  }
});

UI.registerHelper('formatTime', function (time) {
  return moment(time).format("MMM Do YY");
});

UI.registerHelper('loadInfoBuilding', function (id) {
  return Buildings.findOne({_id: id}).neighboorhood;
});