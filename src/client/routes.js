Router.configure({
  layoutTemplate: 'layout',
    waitOn: function () {

    }
});


Router.map(function () {
  this.route('home', {
    template: 'incidents',
    path: '/',
  }),
  this.route('incidences', {
    path: '/incidents',
    template: 'incidents',
  }),
  this.route('drones', {
    path: '/drones',
    template: 'drones',
  })
});

