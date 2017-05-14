'use strict';
/*
  Alpha by HTML5 UP
  html5up.net | @ajlkn
  Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

$(function() {
  var $body = $('body');

  // Dropdowns.
  $('#nav > ul').dropotron({
    alignment: 'right'
  });

  // Navigation Button.
  $(
    '<div id="navButton">' +
    '<a href="#navPanel" class="toggle"></a>' +
    '</div>'
  ).appendTo($body);

  // Navigation Panel.
  $(
    '<div id="navPanel">' +
    '<nav>' +
    $('#nav').navList() +
    '</nav>' +
    '</div>'
  )
    .appendTo($body)
    .panel({
      delay: 500,
      hideOnClick: true,
      hideOnSwipe: true,
      resetScroll: true,
      resetForms: true,
      side: 'left',
      target: $body,
      visibleClass: 'navPanel-visible'
    });
});
