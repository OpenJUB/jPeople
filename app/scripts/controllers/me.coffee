'use strict'

###*
 # @ngdoc function
 # @name jpeopleApp.controller:MeCtrl
 # @description
 # # MeCtrl
 # Controller of the jpeopleApp
###
angular.module('jpeopleApp')
  .controller 'MeCtrl', ($scope, $routeParams, $location, $rootScope, OpenJUB) ->
    $location.path '/' unless OpenJUB.loggedIn()

    OpenJUB.fetchMe()

    $scope.user = {}
    $rootScope.newPage = false

    $scope.$watch ->
      OpenJUB.getMe()
    , (user) ->
      $scope.user = user


