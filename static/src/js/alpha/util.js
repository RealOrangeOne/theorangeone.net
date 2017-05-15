/**
* Generate an indented list of links from a nav. Meant for use with panel().
* @return {jQuery} jQuery object.
*/

'use strict';

$.fn.navList = function() {
  var $a = $(this).find('a');
  var b = [];

  $a.each(function() {
    var	$this = $(this),
      indent = Math.max(0, $this.parents('li').length - 1),
      href = $this.attr('href'),
      target = $this.attr('target');

    b.push(
      '<a ' +
      'class="link depth-' + indent + '"' +
      ( (typeof target !== 'undefined' && target !== '') ? ' target="' + target + '"' : '') +
      ( (typeof href !== 'undefined' && href !== '') ? ' href="' + href + '"' : '') +
      '>' +
      '<span class="indent-' + indent + '"></span>' +
      $this.text() +
      '</a>'
    );
  });

  return b.join('');
};

/**
* Panel-ify an element.
* @param {object} userConfig User config.
* @return {jQuery} jQuery object.
*/
$.fn.panel = function(userConfig) {
  var $this = $(this);

  // No elements?
  if (this.length === 0) {
    return $this;
  }

  // Multiple elements?
  if (this.length > 1) {
    for (var i = 0; i < this.length; i++) {
      $(this[i]).panel(userConfig);
    }
    return $this;
  }

  // Vars.
  var	$this = $(this),
    $body = $('body'),
    $window = $(window),
    id = $this.attr('id'),
    config;

  config = $.extend({
    delay: 0,
    hideOnClick: false,
    hideOnEscape: false,
    hideOnSwipe: false,
    resetScroll: false,
    resetForms: false,
    side: null,
    target: $this,
    visibleClass: 'visible'
  }, userConfig);

  if (typeof config.target !== 'jQuery') {
    config.target = $(config.target);
  }

  $this._hide = function(event) {
    if (!config.target.hasClass(config.visibleClass)) {
      return;
    }

    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    config.target.removeClass(config.visibleClass);

    window.setTimeout(function() {
      if (config.resetScroll) {
        $this.scrollTop(0);
      }
      if (config.resetForms) {
        $this.find('form').each(function() {
          this.reset();
        });
      }

    }, config.delay);

  };

  // Vendor fixes.
  $this
    .css('-ms-overflow-style', '-ms-autohiding-scrollbar')
    .css('-webkit-overflow-scrolling', 'touch');

  if (config.hideOnClick) {
    $this.find('a').css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

    $this.on('click', 'a', function(event) {

      var $a = $(this),
        href = $a.attr('href'),
        target = $a.attr('target');

      if (!href || href === '#' || href === '' || href === '#' + id) {
        return;
      }

      // Cancel original event.
      event.preventDefault();
      event.stopPropagation();

      // Hide panel.
      $this._hide();

      // Redirect to href.
      window.setTimeout(function() {
        if (target === '_blank') {
          window.open(href);
        } else {
          window.location.href = href;
        }
      }, config.delay + 10);
    });
  }

  $this.on('touchstart', function(event) {
    $this.touchPosX = event.originalEvent.touches[0].pageX;
    $this.touchPosY = event.originalEvent.touches[0].pageY;
  });

  $this.on('touchmove', function(event) {
    if ($this.touchPosX === null ||	$this.touchPosY === null) {
      return;
    }

    var	diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
      diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
      th = $this.outerHeight(),
      ts = ($this.get(0).scrollHeight - $this.scrollTop());

    // Hide on swipe?
    if (config.hideOnSwipe) {
      var result = false,
        boundary = 20,
        delta = 50;

      switch (config.side) {
        case 'left':
          result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
          break;

        case 'right':
          result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
          break;

        case 'top':
          result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
          break;

        case 'bottom':
          result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
          break;

        default:
          break;
      }

      if (result) {
        $this.touchPosX = null;
        $this.touchPosY = null;
        $this._hide();

        return false;
      }
    }

    if (($this.scrollTop() < 0 && diffY < 0) || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  $this.on('click touchend touchstart touchmove', function(event) {
    event.stopPropagation();
  });

  // Event: Hide panel if a child anchor tag pointing to its ID is clicked.
  $this.on('click', 'a[href="#' + id + '"]', function(event) {
    event.preventDefault();
    event.stopPropagation();
    config.target.removeClass(config.visibleClass);
  });

  $body.on('click touchend', function(event) {
    $this._hide(event);
  });

  $body.on('click', 'a[href="#' + id + '"]', function(event) {
    event.preventDefault();
    event.stopPropagation();
    config.target.toggleClass(config.visibleClass);
  });
  if (config.hideOnEscape) {
    $window.on('keydown', function(event) {
      if (event.keyCode === 27) {
        $this._hide(event);
      }
    });
  }
  return $this;
};
/**
* Moves elements to/from the first positions of their respective parents.
* @param {jQuery} $elements Elements (or selector) to move.
* @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
*/
$.prioritize = function($elements, condition) {
  var key = '__prioritize';

  // Expand $elements if it's not already a jQuery object.
  if (typeof $elements !== 'jQuery') {
    $elements = $($elements);
  }

  $elements.each(function() {
    var	$e = $(this),
      $p,
      $parent = $e.parent();

    // No parent? Bail.
    if ($parent.length === 0) {
      return;
    }

    if (!$e.data(key)) {
      // Condition is false? Bail.
      if (!condition) {
        return;
      }

      // Get placeholder (which will serve as our point of reference for when this element needs to move back).
      $p = $e.prev();

      // Couldn't find anything? Means this element's already at the top, so bail.
      if ($p.length === 0) {
        return;
      }

      // Move element to top of parent.
      $e.prependTo($parent);

      // Mark element as moved.
      $e.data(key, $p);
    } else {
      if (condition) {
        return;
      }

      $p = $e.data(key);

      // Move element back to its original location (using our placeholder).
      $e.insertAfter($p);

      // Unmark element as moved.
      $e.removeData(key);
    }
  });
};
