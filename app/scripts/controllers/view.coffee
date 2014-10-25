'use strict'

###*
 # @ngdoc function
 # @name jpeopleApp.controller:ViewCtrl
 # @description
 # # ViewCtrl
 # Controller of the jpeopleApp
###
angular.module('jpeopleApp')
  .controller 'ViewCtrl', ($scope, $routeParams, $location, $rootScope, OpenJUB) ->
    $location.path '/' unless $routeParams.username

    OpenJUB.fetchUser $routeParams.username

    $scope.user = {}
    $rootScope.newPage = false

    $scope.$watch ->
      OpenJUB.getUser()
    , (user) ->
      $scope.user = user

    $scope.$watch ->
      OpenJUB.getUrl()
    , (url) ->
      $scope.url = url
