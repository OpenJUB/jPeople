'use strict'

###*
 # @ngdoc function
 # @name jpeopleApp.controller:AboutCtrl
 # @description
 # # AboutCtrl
 # Controller of the jpeopleApp
###
angular.module('jpeopleApp')
  .controller 'AboutCtrl', ($scope, OpenJUB) ->
    $scope.login = () =>
      OpenJUB.login()
