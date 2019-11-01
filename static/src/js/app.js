'use strict';

var Clipboard = require('clipboard');

function waitFor(obj, property, callback) {
  // Wait for a property to exist on window before running callback
  var intervalId = setInterval(function() {
    if (obj.hasOwnProperty(property)) {
      clearInterval(intervalId);
      callback();
    }
  }, 500);
}

$(document).ready(function() {
  waitFor($.fn, 'lightGallery', function() {
    $('#light-gallery').lightGallery({
      thumbnail: true,
      animateThumb: true,
      showThumbByDefault: false,
      download: false,
      share: false,
    });
  });

  new Clipboard('a').on('success', function(e) {
    var ele = $(e.trigger);
    ele.find('i').attr('class', 'fas fa-check');
    alert('Copied "' + ele.data('clipboard-text') + '" to clipboard!');
  });

  // HACK: ToC has blank li if no initial header
  $('#TableOfContents').each(function() {
    var ele = $(this);
    if (ele.find('a').length <= 3) {
      ele.parent().remove();
    } else if (ele.children('ul').children('li').length === 1) {
      ele.children('ul').replaceWith(
        ele
          .children('ul')
          .children('li')
          .children('ul')
      );
    }
  });

  $('.image').each(function() {
    // setup div-image hybrids
    var ele = $(this);
    if (ele.data('image')) {
      ele.css('background-image', 'url(' + ele.data('image') + ')');
    } else {
      ele.removeClass('image');
    }
  });
});

$('.navbar-brand').on('click', function(event) {
  if ($('html').scrollTop() > 100) {
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: 0,
        },
        500
      );
  } else {
    window.location = '/';
  }
  event.preventDefault();
});

$('[data-clipboard-text]').on('click', function(event) {
  event.preventDefault();
});
