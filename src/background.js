chrome.browserAction.onClicked.addListener(function (tab) {
  alert('asdf');
  chrome.browserAction.setBadgeText({ text: 'clicked'});
});

chrome.browserAction.setBadgeText('clicked');
