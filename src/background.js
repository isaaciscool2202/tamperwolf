chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.browserAction.setBadgeText({
      text: 'clicked',
      tabId: tab.id,
    });
  });
});

var rules = [
  { addedOn: 1, name: 'stacko', pattern: '/stackoverflow/', scriptUrl: 'asdf' },
  { addedOn: 2, name: 'github', pattern: '/github/', scriptUrl: 'asdf' }
];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getAllRules') {
    sendResponse(rules);
  }
});
