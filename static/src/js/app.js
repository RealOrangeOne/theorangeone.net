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

function resetHash() {
  // Clear URL hash, without reloading the page - https://stackoverflow.com/a/15323220
  window.history.replaceState(null, document.title, window.location.pathname);
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

  new Elevator({
    element: document.getElementById('scroll-elevator'),
    mainAudio: '/audio/elevator.mp3',
    endAudio: '/audio/ding.mp3',
    preloadAudio: false,
  });

  $('#scroll-top').on('click', function() {
    scrollTo(0);
    resetHash();
  });

  $('a[href^="#"]').on('click', function(event) {
    if (this.dataset.noPreventDefault === undefined) {
      event.preventDefault();
      resetHash();
    }
    const target = $($(this).attr('href'));
    if (target.length) {
      scrollTo(target.offset().top);
    }
  });

  $('.content img').on('click', function(event) {
    event.preventDefault();
    const lightbox = $('#lightbox-modal');
    lightbox.find('img').remove();
    $(this)
      .clone()
      .appendTo(lightbox.find('.modal-content'));
    lightbox.modal();
  });
});
