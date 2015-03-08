
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

    //watch for changes in the suggestions.
    //this should trigger to re-draw the results page.
    $scope.$watch(function() {
      return OpenJUB.getSuggestions();
    }, function(suggestions) {
      $scope.suggestions = suggestions;
      $scope.moreSuggestions = OpenJUB.hasMoreSuggestions();
    });

    $scope.show = function(user) {
      //navigate to the right user.
      return $location.path('/view/' + user.username);
    };

    //when clicking the loadMore button, load more things.
    return $scope.loadMore = function() {
      return OpenJUB.autocompleteMore(function(){
        //trigger an update.
        $scope.$apply();
      });
    };
  });

}).call(this);
