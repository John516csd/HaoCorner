// search.js — client-side iTunes search for list.html
// Reads ?input= from the URL, calls iTunes search API, calls loadResults()

$(document).ready(function() {
  var params  = new URLSearchParams(window.location.search);
  var query   = params.get('input') || '';
  var country = params.get('country') || 'us';

  if (!query.trim()) {
    window.location.href = 'index.html';
    return;
  }

  // Pre-fill the search box and country selector
  $('#link').val(query);
  $('#country-select').val(country);

  // Tokenise the query
  var tokens  = query.trim().split(/\s+/);
  var term    = tokens.map(encodeURIComponent).join('+');
  var apiUrl  = 'https://itunes.apple.com/search?term=' + term + '&limit=200&entity=album&country=' + country;

  $.ajax({
    url:      apiUrl,
    dataType: 'jsonp',
    success: function(data) {
      loadResults(data);
    },
    error: function() {
      $('div.content-wrap').html(
        "<p lang='zh' style='color:#999;font-size:0.875em;padding:20% 0;text-align:center;'>加载失败，请稍后再试。</p>"
      );
    }
  });
});
