
(function() {
  'use strict';

  angular.module('jpeopleApp').controller('ViewCtrl', function($scope, $routeParams, $location, $rootScope, OpenJUB) {
    //if we did not give a user
    //then go back to the root
    if (!$routeParams.username) {
      $location.path('/');
    }

    //we do not have a user or newpage yet.
    $scope.user = {};
    $rootScope.newPage = false;

    //watch the current user.
    $scope.$watch(function() {
      return OpenJUB.getUser();
    }, function(user) {
      return $scope.user = user;
    });

    //watch the url.
    $scope.$watch(function() {
      return OpenJUB.getUrl();
    }, function(url) {
      return $scope.url = url;
    });

    //and get the new user.
    OpenJUB.fetchUser($routeParams.username, function(){
      $scope.$apply();
    });

  });

}).call(this);
