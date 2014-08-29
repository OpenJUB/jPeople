'use strict'

###*
 # @ngdoc function
 # @name jpeopleApp.controller:MainCtrl
 # @description
 # # MainCtrl
 # Controller of the jpeopleApp
###
angular.module('jpeopleApp')
  .controller 'MainCtrl', ($scope, $routeParams, $location, OpenJUB) ->
    
    if ($routeParams.query)
      $('#jPeopleSearchbar').val($routeParams.query)
      OpenJUB.autocomplete($routeParams.query)

    $scope.$watch ->
      OpenJUB.getSuggestions()
    , (suggestions) ->
      console.log 'sug', suggestions
      $scope.suggestions = suggestions

    
    $scope.show = (user) ->
      $location.path('/view/'+user.username)

    $scope.checkFav = (user) ->
      OpenJUB.checkFavorite user.username

    $scope.toggleFav = (user) ->
      if OpenJUB.checkFavorite user.username
        OpenJUB.favorite 'remove', user.username
      else
        OpenJUB.favorite 'add', user.username