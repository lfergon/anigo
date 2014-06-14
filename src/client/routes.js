Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('home', {
    template: 'incidents',
    path: '/',
  }),
  this.route('incidents', {
    path: '/incidents',
    template: 'incidents',
    waitOn: function () {
      return [this.subscribe('incidents', function () {
        console.log('Subscribe to incidents: ' +Incidents.find().count());
      })];
    }
  }),
  this.route('drones', {
    path: '/drones',
    template: 'drones',
  })
});

