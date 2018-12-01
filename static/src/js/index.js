'use strict';

var Clipboard = require('clipboard');

function waitFor(obj, property, callback) {
  // Wait for a property to exist on window before runnig callback
  var intervalId = setInterval(function() {
    if (obj.hasOwnProperty(property)) {
      clearInterval(intervalId);
      callback();
    }
  }, 100);
}

$('.image').each(function() {
  // setup div-image hybrids
  var ele = $(this);
  if (ele.data('image')) {
    ele.css('background-image', 'url(' + ele.data('image') + ')');
  } else {
    ele.removeClass('image');
  }
});

$(document).ready(function() {
  waitFor($.fn, 'lightGallery', function() {
    $('#light-gallery').lightGallery({
      thumbnail: true,
      animateThumb: false,
      showThumbByDefault: false,
      preload: 2,
      download: false,
    });
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

  waitFor(window, 'mermaid', function() {
    mermaid.initialize({
      startOnLoad: true,
    });
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

var clipboard = new Clipboard('a');
clipboard.on('success', function(e) {
  var ele = $(e.trigger);
  ele.find('i').attr('class', 'fas fa-check');
  alert('Copied "' + ele.data('clipboard-text') + '" to clipboard!');
});

$('[data-clipboard-text]').on('click', function(event) {
  event.preventDefault();
});
