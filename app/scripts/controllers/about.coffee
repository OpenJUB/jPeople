'use strict'

###*
 # @ngdoc function
 # @name jpeopleApp.controller:AboutCtrl
 # @description
 # # AboutCtrl
 # Controller of the jpeopleApp
###
angular.module('jpeopleApp')
  .controller 'AboutCtrl', ($scope, $rootScope, $location, OpenJUB) ->
    $rootScope.newPage = false

    $scope.example = (q) =>
      $location.path('/search/'+q)
