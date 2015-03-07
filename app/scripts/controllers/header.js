
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name jpeopleApp.controller:HeaderCtrl
    * @description
    * # HeaderCtrl
    * Controller of the jpeopleApp
   */
  angular.module('jpeopleApp').controller('HeaderCtrl', function($scope, $rootScope, $location, OpenJUB) {
    $rootScope.newPage = true;

    $scope.$watch(function() {
      return OpenJUB.getSuggestions();
    }, function(suggestions) {
      if (suggestions.length > 0) {
        $rootScope.newPage = false;
      }
      return $scope.suggestions = suggestions;
    });

    $scope.$watch(function() {
      return OpenJUB.onCampus();
    }, function(onCampus) {
      return $rootScope.onCampus = onCampus;
    });

    $scope.$watch(function() {
      return OpenJUB.loggedIn();
    }, function(loggedIn) {
      return $rootScope.loggedIn = loggedIn;
    });

    $scope.$watch(function() {
      return OpenJUB.getMe();
    }, function(me) {
      return $rootScope.me = me;
    });

    $scope.$watch(function() {
      return OpenJUB.getUrl();
    }, function(url) {
      return $rootScope.url = url;
    });

    $scope.updateResults = function() {
      if (!($scope.query.length < OpenJUB.minLength())) {
        OpenJUB.autocomplete($scope.query);
      }
      if ($scope.query.length < OpenJUB.minLength()) {
        $location.path('/');
        return OpenJUB.resetSuggestions();
      }
    };

    $scope.pressedEnter = function() {
      if (!($scope.query.length < OpenJUB.minLength())) {
        $location.path('/search/' + $scope.query);
      }
    };

    $scope.login = function() {
      return OpenJUB.login();
    };

    $scope.logout = function() {
      OpenJUB.logout();
      return $location.path('/');
    };

    return $scope.showHelp = function() {
      return $location.path('/about');
    };

  });

}).call(this);
