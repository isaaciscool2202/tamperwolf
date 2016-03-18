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
    if (index) {
      $scope.rules.splice(index, 1);
    }
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

    if (!edited.name.match(/\w[\w ]+/)) {
      errors.push('No name specified!');
    }

    if (!edited.pattern || !isValidRegex(edited.pattern)) {
      errors.push('Invalid regex pattern!');
    }

    if (!edited.scriptUrl.match(/\w[\w ]+/)) {
      errors.push('No script url specified!');
    }

    if (errors.length) {
      $scope.errors = errors;
    }
  };

  var isValidRegex = function (str) {
    try {
      new RegExp(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  var saveData = function () {
    //todo...
  }

  var init = function () {
    chrome.runtime.sendMessage({ action: 'getAllRules' }, function (response) {
      $scope.rules = response;
      $scope.$apply();
    });
  };

  init();

}]);
