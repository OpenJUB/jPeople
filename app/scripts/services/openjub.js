
(function() {
  'use strict';

  /**
    * @ngdoc service
    * @name jpeopleApp.OpenJUB
    * @description
    * # OpenJUB
    * Service in the jpeopleApp.
   */
  angular.module('jpeopleApp').factory('OpenJUB', function($http, $rootScope) {
    var _attachListeners, _authPopup, _autocomplete, _buildFavoritesMap, _checkOnCampus, _clientId, _cookieDomain, _expiredToken, _favorites, _handleMessage, _loggedIn, _loggedInUser, _minLength, _onCampus, _openjubUrl, _plainOpenjubUrl, _setToken, _token, _user, openjub;
    _autocomplete = {
      suggestions: [],
      next: null,
      prev: null
    };
    _user = {};
    _favorites = {};
    _loggedInUser = {};
    _authPopup = null;
    _token = $.cookie('token') ? $.cookie('token') : null;
    _onCampus = $.cookie('onCampus') ? true : false;
    _loggedIn = $.cookie('loggedIn') ? true : false;
    _clientId = 'jpeople';
    _plainOpenjubUrl = "api.jacobs-cs.club";
    _openjubUrl = "https://" + _plainOpenjubUrl;
    _cookieDomain = ".jacobs-cs.club";
    _cookieDomain = "";
    _minLength = 2;
    _buildFavoritesMap = (function(_this) {
      return function(favs) {
        var f, i, len, results;
        _favorites = {};
        results = [];
        for (i = 0, len = favs.length; i < len; i++) {
          f = favs[i];
          results.push(_favorites[f] = true);
        }
        return results;
      };
    })(this);
    _setToken = (function(_this) {
      return function(token) {
        _token = token;
        $.cookie('token', token, {
          domain: _cookieDomain
        });
        console.log('token', token);
      };
    })(this);
    _handleMessage = (function(_this) {
      return function(e) {
        var data;
        if (e.origin !== _openjubUrl) {
          return;
        }
        data = JSON.parse(e.data);
        if ((data != null ? data.token : void 0) != null) {
          _setToken(data.token);
        }
        $.cookie('loggedIn', true, {
          domain: _cookieDomain
        });
        _loggedIn = true;
        $.removeCookie('onCampus', {
          domain: _cookieDomain
        });
        _onCampus = false;
        if (_authPopup != null) {
          _authPopup.close();
        }
        return openjub.fetchMe();
      };
    })(this);
    _checkOnCampus = (function(_this) {
      return function() {
        var requestUrl;
        requestUrl = _openjubUrl + '/auth/oncampus?client_id=' + _clientId;
        return $http.get(requestUrl, {
          fields: ''
        }).success(function(res) {
          if (!_loggedIn) {
            if ((res != null ? res.token : void 0) != null) {
              _setToken(res.token);
            }
            $.cookie('onCampus', true, {
              domain: _cookieDomain
            });
            return _onCampus = true;
          }
        }).error(function(res) {
          if (res.error === 'NotOnCampus') {
            $.removeCookie('onCampus', {
              domain: _cookieDomain
            });
            _onCampus = false;
            if (!_loggedIn) {
              return $.removeCookie('token', {
                domain: _cookieDomain
              });
            }
          }
        });
      };
    })(this);
    _expiredToken = (function(_this) {
      return function() {
        _loggedIn = false;
        _token = null;
        _loggedInUser = {};
        $.removeCookie('token', {
          domain: _cookieDomain
        });
        $.removeCookie('loggedIn', {
          domain: _cookieDomain
        });
        return _checkOnCampus();
      };
    })(this);
    _attachListeners = (function(_this) {
      return function() {
        console.log('attach');
        window.addEventListener('message', _handleMessage, false);
        return window.addEventListener('JUB.tokenExired', _expiredToken, true);
      };
    })(this);
    openjub = {
      autocomplete: (function(_this) {
        return function(str) {
          var requestUrl;
          requestUrl = _openjubUrl + '/user/autocomplete' + '?q=' + str;
          return $http.get(requestUrl, {
            q: str,
            fields: '',
            limit: 25
          }).success(function(res) {
            console.log(res);
            _autocomplete.next = res.next;
            _autocomplete.hasNext = res.data.length < 25 ? false : true;
            return _autocomplete.suggestions = res.data;
          });
        };
      })(this),
      autocompleteMore: (function(_this) {
        return function() {
          if (!(_autocomplete.next && _autocomplete.hasNext)) {
            return;
          }
          return $http.get(_autocomplete.next, {
            fields: ''
          }).success(function(res) {
            _autocomplete.next = res.next;
            _autocomplete.hasNext = res.data.length < 25 ? false : true;
            return _autocomplete.suggestions = _autocomplete.suggestions.concat(res.data);
          });
        };
      })(this),
      hasMoreSuggestions: (function(_this) {
        return function() {
          return _autocomplete.hasNext;
        };
      })(this),
      getSuggestions: (function(_this) {
        return function() {
          return _autocomplete.suggestions;
        };
      })(this),
      resetSuggestions: (function(_this) {
        return function() {
          return _autocomplete.suggestions = [];
        };
      })(this),
      fetchUser: (function(_this) {
        return function(username) {
          var requestUrl;
          requestUrl = _openjubUrl + '/user/' + username;
          return $http.get(requestUrl, {
            fields: ''
          }).success(function(res) {
            console.log('??');
            return _user = res;
          });
        };
      })(this),
      getUser: (function(_this) {
        return function() {
          return _user;
        };
      })(this),
      fetchMe: (function(_this) {
        return function() {
          var requestUrl;
          if (_token === null || _onCampus) {
            return;
          }
          requestUrl = _openjubUrl + '/user/me';
          return $http.get(requestUrl, {
            fields: ''
          }).success(function(res) {
            _loggedInUser = res;
            return _buildFavoritesMap(res.favorites);
          });
        };
      })(this),
      getMe: (function(_this) {
        return function() {
          return _loggedInUser;
        };
      })(this),
      getUrl: (function(_this) {
        return function() {
          return _openjubUrl;
        };
      })(this),
      minLength: (function(_this) {
        return function() {
          return _minLength;
        };
      })(this),
      login: (function(_this) {
        return function() {
          _authPopup = window.open(_openjubUrl + '/login?response_type=token&redirect_uri=/auth/callback&client_id=' + _clientId, '_blank', "width=500, height=400, resizeable=no, toolbar=no, scrollbar=no, location=no");
        };
      })(this),
      loggedIn: (function(_this) {
        return function() {
          return _loggedIn;
        };
      })(this),
      logout: (function(_this) {
        return function() {
          _loggedInUser = {};
          _loggedIn = false;
          _token = null;
          $.removeCookie('token', {
            domain: _cookieDomain
          });
          $.removeCookie('loggedIn', {
            domain: _cookieDomain
          });
          _checkOnCampus();
        };
      })(this),
      onCampus: (function(_this) {
        return function() {
          return _onCampus;
        };
      })(this),
      checkFavorite: (function(_this) {
        return function(username) {
          var check;
          return check = _favorites[username] ? true : false;
        };
      })(this),
      favorite: (function(_this) {
        return function(action, user) {
          var requestUrl;
          if (!_loggedIn) {
            return;
          }
          requestUrl = _openjubUrl + '/user/me/favorite/' + action;
          return $http.post(requestUrl, {
            favorite: user
          }).success(function(res) {
            return _buildFavoritesMap(res.favorites);
          }).error(function(err) {
            return $rootScope.showError(error);
          });
        };
      })(this)
    };
    _attachListeners();
    _checkOnCampus();
    if (_loggedIn) {
      openjub.fetchMe();
    }
    return openjub;
  });

}).call(this);
