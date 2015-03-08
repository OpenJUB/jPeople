
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name jpeopleApp.controller:MeCtrl
    * @description
    * # MeCtrl
    * Controller of the jpeopleApp
   */
  angular.module('jpeopleApp').controller('MeCtrl', function($scope, $routeParams, $location, $rootScope, OpenJUB) {
    if (!OpenJUB.loggedIn()) {
      $location.path('/');
    }

    OpenJUB.fetchMe(function(){
      $scope.$apply();
    });

    $scope.user = {};
    $rootScope.newPage = false;

    return $scope.$watch(function() {
      return OpenJUB.getMe();
    }, function(user) {
      return $scope.user = user;
    });

  });

}).call(this);
