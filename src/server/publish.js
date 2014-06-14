Meteor.publish("incidents", function(){
  return Incidents.find({});
});

Meteor.publish("buildings", function(){
  return Buildings.find({});
});