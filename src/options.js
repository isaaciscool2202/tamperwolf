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
      var newItem = $scope.editedItem;
      newItem.addedOn = Date.now();
      $scope.rules.push(newItem);
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

  var saveData = function () {
    var message = { action: 'saveAllRules', rules: $scope.rules };
    chrome.runtime.sendMessage(message, function (response) {
      $scope.savedAlert = true;
      $scope.$apply();
      window.setTimeout(function () {
        $scope.savedAlert = false;
        $scope.$apply();
      }, 1000);
    });
  };

  var init = function () {
    chrome.runtime.sendMessage({ action: 'getAllRules' }, function (response) {
      $scope.rules = response || [];
      $scope.$apply();
    });
  };

  init();
}]);
