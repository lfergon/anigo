Router.configure({
  layoutTemplate: 'layout',
    waitOn: function () {
      
    }
});
 

Router.map(function () {
  this.route('home', {
    template: 'incidences',
    path: '/',
	}),
  this.route('incidences', {
    path: '/incidences',
    template: 'incidences',
	}),
  this.route('drones', {
		path: '/drones',
    template: 'drones',
  })
});
 
