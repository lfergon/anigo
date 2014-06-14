UI.registerHelper('isActive', function (input) {
  if(Router.current() && Router.current().route.name===input){
    return "active";
  }else{
    return "";
  }
});