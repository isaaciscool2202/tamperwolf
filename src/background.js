var rules = [ ];

var loadRulesFromStorage = function (callback) {
  chrome.storage.sync.get('rules', function (results) {
    rules = results.rules || [];
    if (callback) {
      callback(results);
    }
  });
};

loadRulesFromStorage();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getAllRules') {
    loadRulesFromStorage(function (results) {
      sendResponse(results.rules || []);
    });

    return true;
  }

  if (request.action === 'saveAllRules') {
    chrome.storage.sync.set({ rules: request.rules }, function () {
      rules = request.rules;
      sendResponse({});
    });

    return true;
  }

  if (request.action === 'getRulesForCurrentPage') {
    var url = sender.tab.url;

    var rulesToApply = rules.filter(function (r) {
      try {
        return sender.tab.url.match(new RegExp(r.pattern));
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
