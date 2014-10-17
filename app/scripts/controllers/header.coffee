'use strict'

###*
 # @ngdoc function
 # @name jpeopleApp.controller:HeaderCtrl
 # @description
 # # HeaderCtrl
 # Controller of the jpeopleApp
###
angular.module('jpeopleApp')
  .controller 'HeaderCtrl', ($scope, $rootScope, $location, OpenJUB) ->
    $rootScope.newPage = true
    $scope.$watch ->
      OpenJUB.getSuggestions()
    , (suggestions) ->
      $rootScope.newPage = false if suggestions.length > 0
      $scope.suggestions = suggestions

    $scope.$watch ->
      OpenJUB.onCampus()
    , (onCampus) ->
      $rootScope.onCampus = onCampus

    $scope.$watch ->
      OpenJUB.loggedIn()
    , (loggedIn) ->
      $rootScope.loggedIn = loggedIn

    $scope.$watch ->
      OpenJUB.getMe()
    , (me) ->
      $rootScope.me = me
    
    $scope.$watch ->
      OpenJUB.getUrl()
    , (url) ->
      $rootScope.url = url

    $scope.updateResults = () ->
      OpenJUB.autocomplete $scope.query unless $scope.query.length < 3
      if $scope.query.length < 3
        $location.path '/'
        OpenJUB.resetSuggestions()

    $scope.pressedEnter = () ->
      $location.path '/search/'+$scope.query unless $scope.query.length < 3
      return

    $scope.login = () ->
      OpenJUB.login()

    $scope.logout = () ->
      OpenJUB.logout()
      $location.path '/'

    $scope.showHelp = () ->
      $location.path '/about'
