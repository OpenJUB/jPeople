
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

    //The OpenJUB Client.
    //You may adjust the url to the server here.
    var client = new JUB.Client("http://localhost:6969");

    //a bunch of status variables.
    var
      //My Status
      _onCampus, // is the user on campus.
      _loggedIn, //are we logged in?
      _myName, //currently logged in user.
      _myData, //my current data

      //User Status
      _userName,
      _userData,

      //Search Status
      _currentResults,
      _nextSearch;

    //minimum length for a query.
    var _minLength = 2;


     var openjub = {

      //==============
      //Main Search functionality.
      //==============
      autocomplete: (function(_this) {
        return function(str, callback) {
          //Search for a results.
          client.search(str, [], function(err, res){

            //set the results.
            _currentResults = res.data;

            //if we have enough, the page is full.
            //and there will be more.
            if(res.data.length === 25){
              //the next search result.
              _nextSearch = res.next.bind(res);
            } else {
              //no more results.
              _nextSearch = undefined;
            }

            //call the callback.
            if(typeof callback === 'function'){
              callback();
            }
          });
        };
      })(this),
      autocompleteMore: (function(_this) {
        return function(callback){

          //if we do not have any more suggestions, just return.
          if(!openjub || !openjub.hasMoreSuggestions()){
            return;
          }

          _nextSearch(function(err, res){
            //append more results.
            _currentResults.push.apply(_currentResults, res.data);
            

            //if we have enough, the page is full.
            //and there will be more.
            if(res.data.length === 25){
              //the next search result.
              _nextSearch = res.next.bind(res);
            } else {
              //no more results.
              _nextSearch = undefined;
            }

            //call the callback.
            if(typeof callback === 'function'){
              callback();
            }
          });
        }
      })(this),
      hasMoreSuggestions: (function(_this) {
        return function(){
          //check if we have more things to show.
          return (typeof _nextSearch === 'function');
        }
      })(this),
      getSuggestions: (function(_this) {
        //get the current suggestions.
        return function() {
          return _currentResults;
        };
      })(this),
      resetSuggestions: (function(_this) {
        //reset the suggestions
        return function() {
          _currentResults = [];
          _nextSearch = undefined;
        };
      })(this),

      //==============
      //Fetch a specific user.
      //==============
      fetchUser: (function(_this) {
        return function(username, callback) {
          //fetch data about some user.
          _userName = username;
          client.getUserByName(_userName, [], function(error, data){
            _userData = data;

            if(!error){
              _userData = data;
              //call the callback.
              if(typeof callback === 'function'){
                callback();
              }
            }
          })
        };
      })(this),
      getUser: (function(_this) {
        //get the current user data.
        return function() {
          return _userData;
        };
      })(this),

      //==============
      //Fetch me
      //==============
      fetchMe: (function(_this) {
        return function(callback) {
          //get my name
          _myName = client.user;
          if(_myName){
            client.getMe([], function(error, data){

              if(!error){
                _myData = data;

                //call the callback.
                if(typeof callback === 'function'){
                  callback();
                }
              } else {
                //else logout again.
                //because we do not have user data.
                openjub.logout();
              }
            });
          } else {
            //we did not have a user name.
            //so logout.
            openjub.logout();
          }
        };
      })(this),
      getMe: (function(_this) {
        return function() {
          //return my Data
          return _myData;
        };
      })(this),

      //==============
      //OpenJUB URL
      //==============
      getUrl: (function(_this) {
        //returns the url of OpenJUB.
        return function() {
          return client.server;
        };
      })(this),

      //==============
      //Authentication.
      //==============
      login: (function(_this) {
        return function(callback) {
          //login using the popup
          client.authenticate(function(){
            _loggedIn = true;
            //and fetch the current user afterwards.
            openjub.fetchMe(callback);
          });
        };
      })(this),
      loggedIn: (function(_this) {
        //we are logged in.
        return function() {
          return _loggedIn;
        };
      })(this),
      logout: (function(_this) {
        //signout and clean up.
        return function(callback) {
          client.signout(function(){
            _myName = undefined;
            _myData = undefined;
            _loggedIn = false;

            if(typeof callback === 'function'){
              callback();
            }
          });
        };
      })(this),
      onCampus: (function(_this) {
        //check if we are on campus.
        return function() {
          return _onCampus;
        };
      })(this),

      minLength: (function(_this) {
        //return the minimum query length.
        return function() {
          return _minLength;
        };
      })(this),
    };

    //we are on Campus if there is no error
    //and the parameter is true
    client.isOnCampus(function(error, data){
      _onCampus = !error && data.on_campus;
    });

    //and if we are logged in, fetch me also.
    if (_loggedIn) {
      openjub.fetchMe();
    }

    //return openjub.
    return openjub;
  });

}).call(this);
