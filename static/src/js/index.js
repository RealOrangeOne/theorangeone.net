'use strict';

require('./jquery-global');
require('bootstrap');

// Install alpha things
require('club-alpha/assets/js/jquery.dropotron.min');
require('club-alpha/assets/js/util');
require('lightgallery/dist/js/lightgallery');
require('lg-thumbnail/dist/lg-thumbnail');
require('./alpha/main');
require('./search');


$('.image').each(function () {  // setup div-image hybrids
  var ele = $(this);
  if (ele.data('image')) {
    ele.css('background-image', 'url(' + ele.data('image') + ')');
  } else {
    ele.removeClass('image');
  }
});


$(document).ready(function () {
  $('#light-gallery').lightGallery({
    thumbnail:true,
    animateThumb: false,
    showThumbByDefault: false,
    preload: 2,
    download: false
  });
});

$('.navbar-brand').bind('click', function (event) {
  if ($('html').scrollTop() > 100) {
    $('html, body').stop().animate({
      scrollTop: 0
    }, 500);
  } else {
    window.location = '/';
  }
  event.preventDefault();
});
