chrome.runtime.sendMessage({ action: 'getRulesForCurrentPage' }, (rules) => {
  rules.forEach(run);
});

const JS_PREFIX = "javascript:";

const run = (rule) => {
  const isInlineScript = rule.scriptUrl.startsWith(JS_PREFIX);
  console.log(`Tamperwolf :: running script ${ rule.name } (${ isInlineScript ? "inline js" : "external script" })`);
  if (isInlineScript) {
    runInlineCode(rule.scriptUrl.substring(JS_PREFIX.length));
  } else {
    runExternalScript(rule);
  }
};

const runInlineCode = (jsCode) => {
  var script = document.createElement('script');
  script.setAttribute("type", "text/javascript");
  script.setAttribute("data-inserted-by", "Tamperwolf");
  script.textContent = jsCode;
  document.head.appendChild(script);
};

const runExternalScript = (rule) => {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', rule.scriptUrl, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      runInlineCode(xhr.response);
    }
  };
  xhr.send();
};
