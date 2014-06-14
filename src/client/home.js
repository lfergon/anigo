Template.home.events({
  'click .megatron': function(event) {
    var $megatron = $('.megatron-title')
        .removeClass('animated fadeInDown')
        .addClass('animated flip');
  }
});
