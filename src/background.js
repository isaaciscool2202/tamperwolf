let rules = [];

const loadRulesFromStorage = (callback) => {
  chrome.storage.sync.get('rules', (results) => {
    rules = results.rules || [];
    if (callback) {
      callback(results);
    }
  });
};

loadRulesFromStorage();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getOptions') {
    loadRulesFromStorage(sendResponse);
    return true;
  }

  if (request.action === 'saveOptions') {
    chrome.storage.sync.set(request.data, () => {
      rules = request.data.rules;
      sendResponse({});
    });
    return true;
  }

  if (request.action === 'getRulesForCurrentPage') {
    var url = sender.tab.url;

    var rulesToApply = rules.filter((r) => {
      try {
        return !r.disabled && sender.tab.url.match(new RegExp(r.pattern));
      } catch (e) {
        return false;
      }
    });

    sendResponse(rulesToApply);

    if (rulesToApply.length) {
      chrome.browserAction.setBadgeText({
        text: rulesToApply.length.toString(),
        tabId: sender.tab.id
      });
    };

    return true;
  }
});
