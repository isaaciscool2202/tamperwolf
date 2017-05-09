var app = angular.module('tamperwolf', []);

app.controller('OptionsController', ['$scope', function ($scope) {
  $scope.addNewRule = function () {
    $scope.editedItem = {};
  };

  $scope.edit = function (rule) {
    $scope.editedItem = JSON.parse(JSON.stringify(rule));
    $scope.editedItem.existingRecord = rule;
  };

  $scope.delete = function (rule) {
    var index = $scope.rules.indexOf(rule);
    if (index > -1) {
      $scope.rules.splice(index, 1);
    }

    saveData();
  };

  $scope.cancel = function () {
    $scope.editedItem = null;
  };

  $scope.save = function () {
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

  var validateEditedItem = function () {
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

  var isFilledIn = function (str) {
    return str && str.match(/\w[\w ]*/);
  };

  var isValidRegex = function (str) {
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

  var showSavedAlert = function () {
    $scope.savedAlert = true;
    $scope.$apply();
    window.setTimeout(function () {
      $scope.savedAlert = false;
      $scope.$apply();
    }, 1000);
  };


  var saveData = function () {
    var message = { action: 'saveOptions', data: $scope.options };
    chrome.runtime.sendMessage(message, showSavedAlert);
  };

  var load = function(cb) {
    chrome.runtime.sendMessage({ action: 'getOptions' }, function(response) {
      debugger;
      response = response || [];
      if (response.constructor === Array) {
        // convert from old format (array) to new (object)
        response = { rules: response };
      }
      cb(response);
    });
  };

  var init = function () {
    load(function (response) {
      $scope.options = response;
      $scope.$apply();
    });
  };

  init();


  // $scope.editAsCode = true;
  $scope.toggleCode = function() {
    if ($scope.editAsCode){
      $scope.codeError = '';
      codeEditor.setValue('loading...');
      load(function (response) {
        codeEditor.setValue(JSON.stringify(response, null, 2));
      });
    }
  };


  var codeEditor;
  var setupEditor = function() {
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
  $scope.saveCode = function() {
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
