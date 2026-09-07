// result.js — client-side logic for result.html
// Reads URL params, fetches iTunes lookup if needed, runs Vibrant.js palette,
// calls /api/motion-artwork Worker endpoint, wires up download links.

$(document).ready(function() {

  // ── 1. Parse query params ──────────────────────────────────────────────────
  var params  = new URLSearchParams(window.location.search);
  var way     = params.get('way') || 'smart';
  var inputParam = params.get('input') || '';
  var storeUrl   = params.get('store') || '';
  var artist     = params.get('artist') || '';
  var title      = params.get('title') || '';

  // Show the right search widget based on ?way=
  if (way === 'accurate') {
    $('#search-sm').hide();
    $('#search-ac').show();
  }

  // Pre-select country from URL param (preserved from list page)
  var countryParam = params.get('country') || 'us';
  $('#country-select').val(countryParam);

  // ── 2. Resolve album data ──────────────────────────────────────────────────
  // For 'smart' path: inputParam is artworkUrl100, storeUrl is collectionViewUrl
  // For 'accurate' path: inputParam is the iTunes Store URL — do a lookup first

  function initResultPage(artworkUrl100, collectionViewUrl, artistName, collectionName) {
    document.title = collectionName + ' – CoverBox';

    // Build image URLs
    var small  = artworkUrl100.replace('100x100', '600x600');
    var medium = artworkUrl100.replace('100x100', '1400x1400');
    var large  = artworkUrl100.replace('100x100', '2048x2048');
    var xl     = artworkUrl100.replace('100x100', '3000x3000');

    // Set title / artist text
    $('#result-title').text(collectionName);
    $('#result-artist').text(artistName);

    // Set Apple Music link
    $('#apple-music-link').attr('href', collectionViewUrl);

    // Set static download hrefs
    $('#dl-xl').attr('href', xl);
    $('#dl-large').attr('href', large);
    $('#dl-medium').attr('href', medium);
    $('#dl-small').attr('href', small);

    // ── 3. Check XL image availability ────────────────────────────────────
    var maxWidth = 3000;

    // Shared Vibrant colors — used to style motion buttons after async fetch
    var _bodyTextColor, _backgroundColor, _vibrantReady = false;

    function applyColors(mw) {
      // determine which sizes are actually available
      if (mw < 3000) {
        $('a.xl').css({'border-color': '', 'color': ''});
        $('a.xl').removeAttr('href').removeClass('available');
      }
      if (mw < 2048) {
        $('a.large').css({'border-color': '', 'color': ''});
        $('a.large').removeAttr('href').removeClass('available');
      }
      if (mw < 1400) {
        $('a.medium').css({'border-color': '', 'color': ''});
        $('a.medium').removeAttr('href').removeClass('available');
      }
    }

    // HEAD check for XL — fall back to assuming 3000 available on error
    fetch(xl, { method: 'HEAD' })
      .then(function(res) {
        if (!res.ok) maxWidth = 2048;
      })
      .catch(function() { /* assume 3000 */ })
      .then(function() {
        applyColors(maxWidth);
      });

    // ── 4. Inject cover image (static; replaced by video if motion artwork found) ──
    var $cover = $('.cover');
    var $img = $('<img>')
      .attr('id', 'XL')
      .attr('src', large)
      .attr('alt', 'XL');
    $cover.html($img);

    // ── 5. Motion artwork via /api/motion-artwork Worker ──────────────────
    // Extract album ID from collectionViewUrl
    var idMatch = collectionViewUrl.match(/\/album\/[^/]+\/(\d+)/);
    var countryMatch = collectionViewUrl.match(/(?:music|itunes)\.apple\.com\/([a-z]{2})\//);
    var albumId = idMatch ? idMatch[1] : null;
    var country = countryMatch ? countryMatch[1] : 'us';

    if (albumId) {
      fetch('/api/motion-artwork?id=' + albumId + '&country=' + country)
        .then(function(res) { return res.ok ? res.json() : null; })
        .then(function(data) {
          if (!data || !data.motionUrl) return;

          // Replace static image with video
          var $video = $('<video>')
            .attr('id', 'motion-artwork')
            .attr('autoplay', '')
            .attr('loop', '')
            .attr('muted', '')
            .attr('playsinline', '')
            .attr('poster', large);
          $cover.html($video);

          var video = $video[0];
          var motionSrc = data.motionUrl;
          if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(motionSrc);
            hls.attachMedia(video);
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = motionSrc;
          }

          // Show motion download links
          if (data.variants && data.variants.length) {
            $('#motion-download-label').show();
            var $mg = $('#motion-download-group').empty().show();
            data.variants.forEach(function(v) {
              var dlUrl = '/api/motion-download?url=' + encodeURIComponent(v.url) +
                          '&res=' + encodeURIComponent(v.resolution);
              $mg.append(
                '<div><a class="auto-text-color available" href="' +
                dlUrl + '">' + v.resolution + '</a></div>'
              );
            });
            // Apply Vibrant colors to motion buttons if palette already computed
            if (_vibrantReady) {
              $mg.find('a.available').css('color', _bodyTextColor);
              $mg.find('a.available').hover(
                function() { $(this).css({'color': _backgroundColor, 'background-color': _bodyTextColor}); },
                function() { $(this).css({'color': _bodyTextColor,   'background-color': 'transparent'}); }
              );
            }
          }
        })
        .catch(function() { /* silently ignore — static image remains */ });
    }

    // ── 6. Vibrant.js colour palette ──────────────────────────────────────
    function hexToRgb(hex) {
      var shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthand, function(m, r, g, b) { return r+r+g+g+b+b; });
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    function rgbToHex(r, g, b) {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function getLuminance(r, g, b) {
      return [r, g, b].reduce(function(acc, v, i) {
        v /= 255;
        v = v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        return acc + v * [0.2126, 0.7152, 0.0722][i];
      }, 0);
    }

    function getContrastRatio(rgb1, rgb2) {
      var l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
      var l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    function accessiblePair(bgRgb, minRatio) {
      var white = {r:255,g:255,b:255}, black = {r:0,g:0,b:0};
      var useWhite = getContrastRatio(bgRgb, white) >= getContrastRatio(bgRgb, black);
      var textRgb = useWhite ? white : black;
      var toward  = useWhite ? black : white;
      var bg = {r: bgRgb.r, g: bgRgb.g, b: bgRgb.b};
      for (var i = 0; i <= 100; i++) {
        if (getContrastRatio(bg, textRgb) >= minRatio) break;
        var t = i / 100;
        bg = {
          r: Math.round(bgRgb.r + (toward.r - bgRgb.r) * t),
          g: Math.round(bgRgb.g + (toward.g - bgRgb.g) * t),
          b: Math.round(bgRgb.b + (toward.b - bgRgb.b) * t)
        };
      }
      return { bgHex: rgbToHex(bg.r, bg.g, bg.b), textHex: useWhite ? '#ffffff' : '#000000', bgRgb: bg };
    }

    var paletteImg = document.createElement('img');
    paletteImg.crossOrigin = 'Anonymous';
    paletteImg.setAttribute('src', small);
    paletteImg.addEventListener('load', function() {
      var vibrant   = new Vibrant(paletteImg);
      var swatches  = vibrant.swatches();
      var swatchList = [];

      for (var sw in swatches) {
        if (swatches.hasOwnProperty(sw) && swatches[sw]) {
          swatchList.push({
            hex:        swatches[sw].getHex(),
            population: swatches[sw].getPopulation()
          });
        }
      }
      swatchList.sort(function(a, b) { return b.population - a.population; });
      swatchList = swatchList.slice(0, 5);

      // Background orbs
      var orb1Hex = swatchList[1] ? swatchList[1].hex : (swatchList[0] ? swatchList[0].hex : '#888888');
      var orb2Hex = swatchList[2] ? swatchList[2].hex : orb1Hex;
      document.getElementById('orb1').style.backgroundColor = orb1Hex;
      document.getElementById('orb2').style.backgroundColor = orb2Hex;
      document.getElementById('orb3').style.backgroundColor = orb1Hex;

      // Build palette bar
      var totalPop = swatchList.reduce(function(s, x) { return s + x.population; }, 0);
      var paletteWidth = 238;
      var remaining    = paletteWidth;
      swatchList.forEach(function(s, i) {
        var color = document.createElement('div');
        color.className = 'color';
        color.style.backgroundColor = s.hex;
        var w = (i === swatchList.length - 1)
          ? remaining
          : Math.round(s.population / totalPop * paletteWidth);
        remaining -= w;
        color.style.width = w + 'px';
        $('div.palette').append(color);
      });

      // Derive accessible colour pairs
      var s0 = swatchList[0] ? hexToRgb(swatchList[0].hex) : {r:255,g:255,b:255};
      var s1 = swatchList[1] ? hexToRgb(swatchList[1].hex) : s0;
      var s2 = swatchList[2] ? hexToRgb(swatchList[2].hex) : s1;
      var bgPair  = accessiblePair(s0, 4.5);
      var ctaPair = accessiblePair(s1, 4.5);
      var navPair = accessiblePair(s2, 4.5);
      var backgroundColor = bgPair.bgHex;
      var bodyTextColor   = bgPair.textHex;
      var titleColor      = bgPair.textHex;
      _bodyTextColor = bodyTextColor;
      _backgroundColor   = backgroundColor;
      _vibrantReady      = true;

      // Derived colours
      var backgroundRGB = hexToRgb(backgroundColor);
      var foregroundRGB = hexToRgb(bodyTextColor);
      var r = Math.round(backgroundRGB.r + (foregroundRGB.r - backgroundRGB.r) * 0.4);
      var g = Math.round(backgroundRGB.g + (foregroundRGB.g - backgroundRGB.g) * 0.4);
      var b = Math.round(backgroundRGB.b + (foregroundRGB.b - backgroundRGB.b) * 0.4);
      var transparentColor = rgbToHex(r, g, b);

      var titleRGB = hexToRgb(titleColor);
      r = Math.round(backgroundRGB.r + (titleRGB.r - backgroundRGB.r) * 0.30);
      g = Math.round(backgroundRGB.g + (titleRGB.g - backgroundRGB.g) * 0.30);
      b = Math.round(backgroundRGB.b + (titleRGB.b - backgroundRGB.b) * 0.30);
      var disabledColor = rgbToHex(r, g, b);
      var dividerColor  = 'rgba(' + titleRGB.r + ',' + titleRGB.g + ',' + titleRGB.b + ',0.15)';

      // Apply colours to DOM
      $('.auto-background-color').css('background-color', backgroundColor);
      $('.color').css('border-color', bodyTextColor);
      $('.auto-title-color').css('color', titleColor);
      $('h3').css('color', titleColor);
      $('a.auto-text-color').css('color', bodyTextColor);
      $('#input_link').css('border-top-color', disabledColor);
      $('#input_link input[type=text]').css('border-color', transparentColor);
      $('footer').css('color', bodyTextColor);
      $('footer a:link').css('color', bodyTextColor);
      $('footer a:visited').css('color', bodyTextColor);
      $('.modal:not(.changelog-modal)').css('color', bodyTextColor);
      $('nav a.support').css({'background-color': navPair.bgHex, 'color': navPair.textHex});
      $('.coffee-cups').css('color', bodyTextColor);
      $('.col-divider, .section-divider').css('background-color', dividerColor);

      // Dim unavailable sizes
      if (maxWidth < 3000) {
        $('a.xl').css({'border-color': dividerColor, 'color': dividerColor})
          .removeAttr('href').removeClass('available');
      }
      if (maxWidth < 2048) {
        $('a.large').css({'border-color': dividerColor, 'color': dividerColor})
          .removeAttr('href').removeClass('available');
      }
      if (maxWidth < 1400) {
        $('a.medium').css({'border-color': dividerColor, 'color': dividerColor})
          .removeAttr('href').removeClass('available');
      }

      // Hover state for download links
      $('a.available').hover(
        function() { $(this).css({'color': backgroundColor, 'background-color': bodyTextColor}); },
        function() { $(this).css({'color': bodyTextColor,   'background-color': 'transparent'}); }
      );

      // CTA button colour
      if (ctaPair) {
        $('a.button').css({'background-color': ctaPair.bgHex, 'color': ctaPair.textHex});
        var toward = ctaPair.textHex === '#ffffff' ? {r:0,g:0,b:0} : {r:255,g:255,b:255};
        var hr = ctaPair.bgRgb;
        var hoverRgb = {
          r: Math.round(hr.r + (toward.r - hr.r) * 0.15),
          g: Math.round(hr.g + (toward.g - hr.g) * 0.15),
          b: Math.round(hr.b + (toward.b - hr.b) * 0.15)
        };
        var hoverHex = rgbToHex(hoverRgb.r, hoverRgb.g, hoverRgb.b);
        $('a.button').hover(
          function() { $(this).css('background-color', hoverHex); },
          function() { $(this).css('background-color', ctaPair.bgHex); }
        );
      }
    });
  }

  // ── Dispatch: smart vs accurate ───────────────────────────────────────────
  if (way === 'smart') {
    if (!inputParam) { window.location.href = 'index.html'; return; }
    initResultPage(inputParam, storeUrl, artist, title);

  } else {
    // accurate path: inputParam is the iTunes store URL — extract ID and lookup
    if (!inputParam) { window.location.href = 'warning.html'; return; }

    var idMatch = inputParam.match(/\/album\/[^/]+\/(\d+)|\/id(\d+)/);
    var albumId = idMatch ? (idMatch[1] || idMatch[2]) : null;
    var countryMatch = inputParam.match(/music\.apple\.com\/([a-z]{2})\//);
    var country = countryMatch ? countryMatch[1] : 'us';

    if (!albumId) { window.location.href = 'warning.html'; return; }

    $.ajax({
      url: 'https://itunes.apple.com/lookup?id=' + albumId + '&country=' + country,
      dataType: 'jsonp',
      success: function(data) {
        if (!data || !data.results || !data.results[0]) {
          window.location.href = 'warning.html';
          return;
        }
        var r = data.results[0];
        initResultPage(
          r.artworkUrl100,
          r.collectionViewUrl || inputParam,
          r.artistName,
          r.collectionName
        );
      },
      error: function() {
        window.location.href = 'warning.html';
      }
    });
  }

});
