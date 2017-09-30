$(document).ready(function(){
  var FADE_SETTINGS = {
    duration: 400
  };

  $("input#search").keyup(function() {
    var filter = new RegExp($(this).val(), 'gi');
    $("div.search-results > div").each(function(){
      if ($(this).text().search(filter) === -1) {
        $(this).fadeOut(FADE_SETTINGS);
      } else {
        $(this).fadeIn(FADE_SETTINGS);
      }
    });
  });
});
