'use strict'

###*
 # @ngdoc service
 # @name jpeopleApp.OpenJUB
 # @description
 # # OpenJUB
 # Service in the jpeopleApp.
###
angular.module('jpeopleApp')
  .factory 'OpenJUB', ($http, $rootScope) ->
    # AngularJS will instantiate a singleton by calling "new" on this function
    _autocomplete =
      suggestions: []
      next: null
      prev: null
    _user = {}
    _favorites = {}
    _loggedInUser = {}
    _authPopup = null
    _token = if ($.cookie 'token') then $.cookie 'token' else null
    _onCampus = if ($.cookie 'onCampus') then true else false
    _loggedIn = if ($.cookie 'loggedIn') then true else false

    _clientId = 'jpeople'

    _plainOpenjubUrl = "open.jacobs-cs.club"
    _openjubUrl = "http://" + _plainOpenjubUrl
    # _openjubUrl = "http://openjub.ngrok.com"

    _buildFavoritesMap = (favs) =>
      _favorites = {}
      for f in favs
        _favorites[f] = true

    _setToken = (token) =>
      _token = token
      $.cookie 'token', token, 
        domain: '.jacobs-cs.club'
      console.log 'token', token
      return

    _handleMessage = (e) =>
      return unless e.origin is _openjubUrl
      data = JSON.parse e.data
      _setToken data.token if data?.token?
      $.cookie 'loggedIn', true, 
        domain: '.jacobs-cs.club'
      _loggedIn = true
      $.removeCookie 'onCampus'
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
          $.cookie 'onCampus', true, 
            domain: '.jacobs-cs.club'
          _onCampus = true
      .error (res) =>
        if res.error is 'NotOnCampus'
          $.removeCookie 'onCampus'
          _onCampus = false
          unless _loggedIn
            $.removeCookie 'token'

    _expiredToken = () =>
      _loggedIn = false
      _token = null
      _loggedInUser = {}
      $.removeCookie 'token'
      $.removeCookie 'loggedIn'
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
          limit: 25
        .success (res) =>
          console.log res
          _autocomplete.next = res.next
          _autocomplete.hasNext = if res.data.length < 25 then false else true
          _autocomplete.suggestions = res.data

      autocompleteMore: () =>
        return unless _autocomplete.next and _autocomplete.hasNext
        $http.get _autocomplete.next,
          fields: ''
        .success (res) =>
          _autocomplete.next = res.next
          _autocomplete.hasNext = if res.data.length < 25 then false else true
          _autocomplete.suggestions = _autocomplete.suggestions.concat res.data

      hasMoreSuggestions: () =>
        _autocomplete.hasNext

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
          _buildFavoritesMap res.favorites

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
        $.removeCookie 'token'
        $.removeCookie 'loggedIn'
        _checkOnCampus()
        return

      onCampus: () =>
        _onCampus

      checkFavorite: (username) =>
        check = if (_favorites[username]) then true else false

      favorite: (action, user) =>
        return unless _loggedIn
        requestUrl = _openjubUrl + '/user/me/favorite/' + action
        $http.post requestUrl,
          favorite: user
        .success (res) =>
          _buildFavoritesMap res.favorites
        .error (err) =>
          $rootScope.showError error

    _attachListeners()
    _checkOnCampus()
    if _loggedIn
      openjub.fetchMe()

    openjub