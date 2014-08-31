'use strict'

###*
 # @ngdoc overview
 # @name jpeopleApp
 # @description
 # # jpeopleApp
 #
 # Main module of the application.
###
angular
  .module('jpeopleApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.keypress'
  ])
  .config ($routeProvider, $locationProvider, $httpProvider) ->
    $routeProvider
      .when '/',
        templateUrl: '/views/main.html'
        controller: 'MainCtrl'
      .when '/search/:query',
        templateUrl: '/views/main.html'
        controller: 'MainCtrl'
      .when '/about',
        templateUrl: '/views/about.html'
        controller: 'AboutCtrl'
      .when '/me',
        templateUrl: '/views/view.html'
        controller: 'MeCtrl'
      .when '/view/:username',
        templateUrl: '/views/view.html'
        controller: 'ViewCtrl'
      .when '/favorites',
        redirectTo: '/search/favorites'
      .otherwise
        redirectTo: '/'
        
    $locationProvider.html5Mode true
    $httpProvider.interceptors.push 'authInterceptor'

  .factory 'authInterceptor', ($rootScope, $q, $location) ->
    # Add authorization token to headers
    request: (config) ->
      config.headers = config.headers or {}
      config.headers.Authorization = 'Bearer ' + $.cookie 'token' if $.cookie 'token'
      config

    # Intercept 401s and redirect you to login
    responseError: (response) ->
      console.log 'resp', response
      if response.status is 401 and response.data?.error isnt 'NotOnCampus'
        $location.path '/'
        $rootScope.newPage = true
        $rootScope.showError 'Please log in or connect to VPN to be virtually on campus.'
        $.removeCookie 'token'
        $.removeCookie 'loggedIn'
        # remove any stale tokens
        expireTokenEvent = new Event 'JUB.tokenExpired'
        window.dispatchEvent expireTokenEvent

      $q.reject response

  .run ($rootScope, $location) ->
    $rootScope.globalAlert = 
      type: 'alert-info'
      show: false
      title: 'Info:'
      message: 'Some blabla bla'

    $rootScope.showMessage = (type, title, message, time) ->
      $rootScope.globalAlert.show = false
      message = 
        type: type
        title: title
        message: message
        show: true 
      $rootScope.globalAlert = message
      time ?= 3500
      if typeof time is 'number'
        setTimeout () ->
          $rootScope.$apply () ->
            $rootScope.globalAlert.show = false
        , time

    $rootScope.showInfo = (message, time) ->
      $rootScope.showMessage 'alert-info', 'Info:', message, time

    $rootScope.showWarning = (message, time) ->
      $rootScope.showMessage 'alert-warning', 'Warning:', message, time

    $rootScope.showError = (message, time) ->
      $rootScope.showMessage 'alert-danger', 'Error:', message, time

    $rootScope.showSuccess = (message, time) ->
      $rootScope.showMessage 'alert-success', 'Success:', message, time

randomizePlaceholder = () ->
  values = [
    'Time To Stalk',
    'Who\'s that chick?',
    'Who\'s that dude?',
    'I don\'t know you!',
    '#stalk'
  ]

  index = Math.floor(Math.random() * values.length)

  $('#jPeopleSearchbar').attr('placeholder', values[index])
  return

jQuery () ->
  setInterval () ->
    randomizePlaceholder()
  , 2000