
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

    //watch for suggestions
    //and add them to the page?
    $scope.$watch(function() {
      return OpenJUB.getSuggestions();
    }, function(suggestions) {

      if (suggestions.length > 0) {
        $rootScope.newPage = false;
      }

      return $scope.suggestions = suggestions;
    });

    //watch for onCampus.
    $scope.$watch(function() {
      return OpenJUB.onCampus();
    }, function(onCampus) {
      return $rootScope.onCampus = onCampus;
    });

    //check if we are loggedIn.
    $scope.$watch(function() {
      return OpenJUB.loggedIn();
    }, function(loggedIn) {
      return $rootScope.loggedIn = loggedIn;
    });

    //check who I am
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
      if ($scope.query.length >= OpenJUB.minLength()) {
        OpenJUB.autocomplete($scope.query, function(){
          $scope.$apply();
        });
      } else {
        $location.path('/');
        OpenJUB.resetSuggestions();
        $scope.$apply();
      }

    };

    $scope.pressedEnter = function() {
      if (!($scope.query.length < OpenJUB.minLength())) {
        $location.path('/search/' + $scope.query);
        $scope.$apply();
      }
    };

    $scope.login = function() {
      if(OpenJUB.loggedIn()){
        $scope.$apply();
      } else {
        return OpenJUB.login(function(){
          $scope.$apply();
        });
      }
    };

    $scope.logout = function() {
      OpenJUB.logout(function(){
        $scope.$apply();
      });
      return $location.path('/');
    };

    return $scope.showHelp = function() {
      return $location.path('/about');
    };

  });

}).call(this);
