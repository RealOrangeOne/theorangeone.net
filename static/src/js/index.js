'use strict';

require('./jquery-global');
require('bootstrap');

// Install alpha things
require('club-alpha/assets/js/jquery.dropotron.min');
require('club-alpha/assets/js/util');
require('./alpha/main');


$('.image').each(function () {  // setup div-image hybrids
  var ele = $(this);
  if (ele.data('image')) {
    ele.css('background-image', 'url(' + ele.data('image') + ')');
  } else {
    ele.removeClass('image');
  }
});
