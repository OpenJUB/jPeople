
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name jpeopleApp.controller:MainCtrl
    * @description
    * # MainCtrl
    * Controller of the jpeopleApp
   */
  angular.module('jpeopleApp').controller('MainCtrl', function($scope, $routeParams, $location, OpenJUB) {
    if ($routeParams.query) {
      $('#jPeopleSearchbar').val($routeParams.query);
      OpenJUB.autocomplete($routeParams.query);
    }

    $scope.$watch(function() {
      return OpenJUB.getSuggestions();
    }, function(suggestions) {
      console.log('sug', suggestions);
      $scope.suggestions = suggestions;
      return $scope.moreSuggestions = OpenJUB.hasMoreSuggestions();
    });

    $scope.$watch(function() {
      return OpenJUB.getUrl();
    }, function(url) {
      return $scope.url = url;
    });

    $scope.show = function(user) {
      return $location.path('/view/' + user.username);
    };

    return $scope.loadMore = function() {
      return OpenJUB.autocompleteMore();
    };
  });

}).call(this);
