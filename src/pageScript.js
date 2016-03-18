chrome.runtime.sendMessage({ action: 'getRulesForCurrentPage' }, function (rules) {
  rules.forEach(run);
});

var run = function (rule) {
  console.log('Tamperwolf :: running script ' + rule.name);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', rule.scriptUrl, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = xhr.responseText;
      document.head.appendChild(script);
    }
  };

  xhr.send();
};
