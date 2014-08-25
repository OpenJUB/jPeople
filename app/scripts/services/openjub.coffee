'use strict'

###*
 # @ngdoc service
 # @name jpeopleApp.OpenJUB
 # @description
 # # OpenJUB
 # Service in the jpeopleApp.
###
angular.module('jpeopleApp')
  .factory 'OpenJUB', ($http, $cookieStore) ->
    # AngularJS will instantiate a singleton by calling "new" on this function
    _autocomplete =
      suggestions: []
      next: null
      prev: null
    _user = {}
    _loggedInUser = {}
    _authPopup = null
    _token = if ($cookieStore.get 'token') then $cookieStore.get 'token' else null
    _onCampus = if ($cookieStore.get 'onCampus') then true else false
    _loggedIn = if ($cookieStore.get 'loggedIn') then true else false

    _clientId = 'foo'

    _openjubUrl = "http://localhost:6969"

    _setToken = (token) =>
      _token = token
      $cookieStore.put 'token', token
      console.log 'token', token
      return

    _handleMessage = (e) =>
      return unless e.origin is _openjubUrl
      data = JSON.parse e.data
      _setToken data.token if data?.token?
      $cookieStore.put 'loggedIn', true
      _loggedIn = true
      $cookieStore.remove 'onCampus'
      _onCampus = false
      _authPopup?.close()
      openjub.fetchMe()

    _checkOnCampus = () =>
      requestUrl = _openjubUrl + '/auth/oncampus?client_id=' + _clientId
      $http.get requestUrl,
        fields: ''
      .success (res) =>
        unless _loggedIn
          _setToken res.token if res?.token?
          $cookieStore.put 'onCampus', true
          _onCampus = true
      .error (res) =>
        if res.error is 'NotOnCampus'
          $cookieStore.remove 'onCampus'
          _onCampus = false
          unless _loggedIn
            $cookieStore.remove 'token'

    _expiredToken = () =>
      _loggedIn = false
      _token = null
      _loggedInUser = {}
      $cookieStore.remove 'token'
      $cookieStore.remove 'loggedIn'
      _checkOnCampus()

    _attachListeners = () =>
      console.log 'attach'
      window.addEventListener 'message', _handleMessage, false
      window.addEventListener 'JUB.tokenExired', _expiredToken, true

    openjub = 
      autocomplete: (str) =>
        requestUrl = _openjubUrl + '/user/autocomplete' + '?q=' + str
        $http.get requestUrl, 
          q: str,
          fields: ''
        .success (res) =>
          _autocomplete.suggestions = res.data

      getSuggestions: () =>
        _autocomplete.suggestions

      resetSuggestions: () =>
        _autocomplete.suggestions = []

      fetchUser: (username) =>
        requestUrl = _openjubUrl + '/user/' + username
        $http.get requestUrl,
          fields: ''
        .success (res) =>
          console.log('??')
          _user = res

      getUser: () =>
        _user

      fetchMe: () =>
        return if _token is null or _onCampus
        requestUrl = _openjubUrl + '/user/me'
        $http.get requestUrl,
          fields: ''
        .success (res) =>
          _loggedInUser = res

      getMe: () =>
        _loggedInUser

      login: () =>
        _authPopup = window.open(_openjubUrl + '/login?response_type=token&redirect_uri=/auth/callback&client_id='+_clientId, '_blank', "width=500, height=400, resizeable=no, toolbar=no, scrollbar=no, location=no")
        return

      loggedIn: () =>
        _loggedIn

      logout: () =>
        _loggedInUser = {}
        _loggedIn = false
        _token = null
        $cookieStore.remove 'token'
        $cookieStore.remove 'loggedIn'
        _checkOnCampus()
        return

      onCampus: () =>
        _onCampus

    _attachListeners()
    _checkOnCampus()
    if _loggedIn
      openjub.fetchMe()

    openjub