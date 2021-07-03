const Elevator = require('elevator.js');

function waitFor(obj, property, callback) {
  // Wait for a property to exist on window before running callback
  const intervalId = setInterval(function() {
    if (property in obj) {
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

  // HACK: ToC has blank li if no initial header
  $('#TableOfContents').each(function() {
    let ele = $(this);
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
    const ele = $(this);
    if (ele.data('image')) {
      ele.css('background-image', 'url(' + ele.data('image') + ')');
    } else {
      ele.removeClass('image');
    }
  });

  new Elevator({
    element: document.getElementById('scroll-elevator'),
    mainAudio: '/audio/elevator.mp3',
    endAudio: '/audio/ding.mp3',
    preloadAudio: false,
  });
});

function scrollTo(offset) {
  $('html, body')
    .stop()
    .animate(
      {
        scrollTop: offset,
      },
      500
    );
}

$('#scroll-top').on('click', function(event) {
  event.preventDefault();
  scrollTo(0);
});

$('a[href^="#"] ').on('click', function(event) {
  event.preventDefault();
  const target = $($(this).attr('href'));
  if (target.length) {
    scrollTo(target.offset().top);
  }
});
