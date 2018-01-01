'use strict';

var fontawesome = require('@fortawesome/fontawesome');
var solid = require('@fortawesome/fontawesome-free-solid');
var regular = require('@fortawesome/fontawesome-free-regular');
var brands = require('@fortawesome/fontawesome-free-brands');

try {
  fontawesome.library.add(solid);
  fontawesome.library.add(regular);
  fontawesome.library.add(brands);
} catch (e) {
  // Sometimes loading icons raises an exception, even when there's no invalid icons on the screen
}
