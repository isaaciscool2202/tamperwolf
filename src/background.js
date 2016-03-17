chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.browserAction.setBadgeText({
      text: 'clicked',
      tabId: tab.id
    });
  });
});

chrome.browserAction.setBadgeText('clicked');
