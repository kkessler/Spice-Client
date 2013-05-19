chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('spice.html', {
    'width': 800,
    'height': 600
  });
});
