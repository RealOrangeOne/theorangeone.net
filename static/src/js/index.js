'use strict';

require('./jquery-global');
require('bootstrap');

require('lightgallery/dist/js/lightgallery');
require('lg-thumbnail/dist/lg-thumbnail');

require('plyr').setup();


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

  // HACK: ToC has blank li if no initial header
  $('#TableOfContents').each(function () {
    var ele = $(this);
    if (ele.find('a').length <= 3) {
      ele.parent().remove();
    } else if (ele.children('ul').children('li').length === 1) {
      ele.children('ul').replaceWith(ele.children('ul').children('li').children('ul'));
    }
  });
});

$('.navbar-brand').on('click', function (event) {
  if ($('html').scrollTop() > 100) {
    $('html, body').stop().animate({
      scrollTop: 0
    }, 500);
  } else {
    window.location = '/';
  }
  event.preventDefault();
});
