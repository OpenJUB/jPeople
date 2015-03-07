(function() {
  'use strict';

  /**
    * @ngdoc overview
    * @name jpeopleApp
    * @description
    * # jpeopleApp
   #
    * Main module of the application.
   */
  var randomizePlaceholder;

  angular.module('jpeopleApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.keypress']).config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/', {
      templateUrl: '/views/main.html',
      controller: 'MainCtrl'
    }).when('/search/:query', {
      templateUrl: '/views/main.html',
      controller: 'MainCtrl'
    }).when('/about', {
      templateUrl: '/views/about.html',
      controller: 'AboutCtrl'
    }).when('/me', {
      templateUrl: '/views/view.html',
      controller: 'MeCtrl'
    }).when('/view/:username', {
      templateUrl: '/views/view.html',
      controller: 'ViewCtrl'
    }).when('/favorites', {
      redirectTo: '/search/favorites'
    }).otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
    return $httpProvider.interceptors.push('authInterceptor');
  }).factory('authInterceptor', function($rootScope, $q, $location) {
    return {
      //Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if ($.cookie('token')) {
          config.headers.Authorization = 'Bearer ' + $.cookie('token');
        }
        return config;
      },
      //# Intercept 401s and redirect you to login
      responseError: function(response) {
        var expireTokenEvent, ref;
        console.log('resp', response);
        if (response.status === 401 && ((ref = response.data) != null ? ref.error : void 0) !== 'NotOnCampus') {
          $location.path('/');
          $rootScope.newPage = true;
          $rootScope.showError('Please log in or connect to VPN to be virtually on campus.');
          $.removeCookie('token', {
            domain: '.jacobs-cs.club'
          });
          $.removeCookie('loggedIn', {
            domain: '.jacobs-cs.club'
          });
          expireTokenEvent = new Event('JUB.tokenExpired');
          window.dispatchEvent(expireTokenEvent);
        }
        return $q.reject(response);
      }
    };
  }).run(function($rootScope, $location) {
    $rootScope.globalAlert = {
      type: 'alert-info',
      show: false,
      title: 'Info:',
      message: 'Some blabla bla'
    };
    $rootScope.showMessage = function(type, title, message, time) {
      $rootScope.globalAlert.show = false;
      message = {
        type: type,
        title: title,
        message: message,
        show: true
      };
      $rootScope.globalAlert = message;
      if (time == null) {
        time = 3500;
      }
      if (typeof time === 'number') {
        return setTimeout(function() {
          return $rootScope.$apply(function() {
            return $rootScope.globalAlert.show = false;
          });
        }, time);
      }
    };
    $rootScope.showInfo = function(message, time) {
      return $rootScope.showMessage('alert-info', 'Info:', message, time);
    };
    $rootScope.showWarning = function(message, time) {
      return $rootScope.showMessage('alert-warning', 'Warning:', message, time);
    };
    $rootScope.showError = function(message, time) {
      return $rootScope.showMessage('alert-danger', 'Error:', message, time);
    };
    return $rootScope.showSuccess = function(message, time) {
      return $rootScope.showMessage('alert-success', 'Success:', message, time);
    };
  });

  randomizePlaceholder = function() {
    var index, values;
    values = ['Time To Stalk', 'Who\'s that chick?', 'Who\'s that dude?', 'I don\'t know you!', '#stalk'];
    index = Math.floor(Math.random() * values.length);
    $('#jPeopleSearchbar').attr('placeholder', values[index]);
  };

  jQuery(function() {
    return setInterval(function() {
      return randomizePlaceholder();
    }, 2000);
  });

}).call(this);
