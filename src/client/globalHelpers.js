UI.registerHelper('isActive', function (input) {
  if(Router.current() && Router.current().route.name===input){
    return "active";
  }else{
    return "";
  }
});

UI.registerHelper('formatTime', function (time) {
  return moment(time).format("HH:mm DD/MM/YY");
});

UI.registerHelper('loadInfoBuilding', function (id) {
  return Buildings.findOne({_id: id}).neighboorhood;
});

UI.registerHelper('priorityColour', function(priority) {
  if (priority === 'medium') {
    return 'text-info';
  } else if (priority === 'high') {
    return 'text-warning';
  } else if (priority === 'critical') {
    return 'text-danger';
  } else {
    return 'text-muted';
  }
});
