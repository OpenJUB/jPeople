
(function() {
  'use strict';

  //shows the about page.
  angular.module('jpeopleApp').controller('AboutCtrl', function($scope, $rootScope, $location, OpenJUB) {
    $rootScope.newPage = false;

    //allow to search the example.
    return $scope.example = (function(_this) {
      return function(q) {
        $location.path('/search/' + q);
        $scope.apply(); 
      };
    })(this);
  });

}).call(this);
