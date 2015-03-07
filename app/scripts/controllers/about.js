
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name jpeopleApp.controller:AboutCtrl
    * @description
    * AboutCtrl
    * Controller of the jpeopleApp
   */
  angular.module('jpeopleApp').controller('AboutCtrl', function($scope, $rootScope, $location, OpenJUB) {
    $rootScope.newPage = false;
    return $scope.example = (function(_this) {
      return function(q) {
        return $location.path('/search/' + q);
      };
    })(this);
  });

}).call(this);
