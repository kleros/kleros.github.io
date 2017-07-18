
$('body').scrollspy({ target: '#navbar-top' });
$("#navbar-top ul li a[href^='#']").on('click', function(e) {
 // prevent default anchor click behavior
 e.preventDefault();
 // store hash
 var hash = this.hash;
 // animate
 $('html, body').animate({
     scrollTop: $(hash).offset().top
   }, 500, function(){
     // when done, add hash to url
     // (default click behaviour)
     window.location.hash = hash;
  });
});
$(document).scroll(function () {
  console.log('scroll');
  var $nav = $(".navbar-fixed-top");
  $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
});
