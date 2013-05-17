chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('spice.html', {
    'width': 900,
    'height': 750
  });
});
