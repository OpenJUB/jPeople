
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name jpeopleApp.controller:ViewCtrl
    * @description
    * # ViewCtrl
    * Controller of the jpeopleApp
   */
  angular.module('jpeopleApp').controller('ViewCtrl', function($scope, $routeParams, $location, $rootScope, OpenJUB) {
    if (!$routeParams.username) {
      $location.path('/');
    }
    OpenJUB.fetchUser($routeParams.username);
    $scope.user = {};
    $rootScope.newPage = false;
    $scope.$watch(function() {
      return OpenJUB.getUser();
    }, function(user) {
      return $scope.user = user;
    });
    return $scope.$watch(function() {
      return OpenJUB.getUrl();
    }, function(url) {
      return $scope.url = url;
    });
  });

}).call(this);
