var app = angular.module('tamperwolf', []);

app.controller('OptionsController', ['$scope', ($scope) => {
  $scope.addNewRule = () => {
    $scope.editedItem = {};
  };

  $scope.edit = (rule) => {
    $scope.editedItem = JSON.parse(JSON.stringify(rule));
    $scope.editedItem.existingRecord = rule;
  };

  $scope.delete = (rule) => {
    var index = $scope.options.rules.indexOf(rule);
    if (index > -1) {
      $scope.options.rules.splice(index, 1);
    }

    saveData();
  };

  $scope.cancel = () => {
    $scope.editedItem = null;
  };

  $scope.toggle = (r) => {
    saveData();
  };

  $scope.save = () =>  {
    validateEditedItem();

    if ($scope.errors) {
      return;
    }

    if ($scope.editedItem.existingRecord) {
      var existing = $scope.editedItem.existingRecord;

      existing.name = $scope.editedItem.name;
      existing.pattern = $scope.editedItem.pattern;
      existing.scriptUrl = $scope.editedItem.scriptUrl;
    } else {
      debugger;
      var newItem = $scope.editedItem;
      newItem.addedOn = Date.now();
      $scope.options.rules.push(newItem);
    }

    saveData();

    $scope.editedItem = null;
  };

  var validateEditedItem = () =>  {
    $scope.errors = null;

    var edited = $scope.editedItem;
    if (!edited) {
      return;
    }

    var errors = [];

    if (!edited.name.match(/\w[\w ]*/)) {
      errors.push('No name specified!');
    }

    if (!isValidRegex(edited.pattern)) {
      errors.push('Invalid regex pattern!');
    }

    if (!edited.scriptUrl.match(/\w[\w ]*/)) {
      errors.push('No script url specified!');
    }

    if (errors.length) {
      $scope.errors = errors;
    }
  };

  var isFilledIn = (str) => {
    return str && str.match(/\w[\w ]*/);
  };

  var isValidRegex = (str) => {
    if (!str) {
      return false;
    }

    try {
      new RegExp(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  var showSavedAlert = () => {
    $scope.savedAlert = true;
    $scope.$apply();
    window.setTimeout(() => {
      $scope.savedAlert = false;
      $scope.$apply();
    }, 1000);
  };


  var saveData = () => {
    var message = { action: 'saveOptions', data: $scope.options };
    chrome.runtime.sendMessage(message, showSavedAlert);
  };

  var load = (cb) => {
    chrome.runtime.sendMessage({ action: 'getOptions' }, (response) => {
        response = Object.assign({ rules: [] }, response);
      if (response.constructor === Array) {
        // convert from old format (array) to new (object)
        response = { rules: response };
      }
      cb(response);
    });
  };

  var init = () => {
    load((response) => {
      $scope.options = response;
      $scope.$apply();
    });
  };

  init();


  // $scope.editAsCode = true;
  $scope.toggleCode = () => {
    if ($scope.editAsCode){
      $scope.codeError = '';
      codeEditor.setValue('loading...');
      load((response) => {
        codeEditor.setValue(JSON.stringify(response, null, 2));
      });
    }
  };


  var codeEditor;
  var setupEditor = () => {
    if (!ace) {
      setTimeout(setupEditor, 100);
      return;
    }
    var txt = document.getElementById('editor');
    codeEditor = ace.edit(txt);
    var session = codeEditor.getSession();
    session.setMode('ace/mode/javascript');
  };
  setupEditor();

  $scope.yes = 'no';
  $scope.saveCode = () =>{
    try{
      $scope.codeError = '';
      var code = codeEditor.getValue();
      var newOptions = JSON.parse(code);
      $scope.options = newOptions;
      var message = { action: 'saveOptions', data: $scope.options };
      chrome.runtime.sendMessage(message, showSavedAlert);
    } catch (e) {
      $scope.codeError = e.message;
    }
  };
}]);
