(function() {
  'use strict';

  /**
   * {Factory} UserSrv
   * @fileOverview User info handler
   */
  angular
    .module('ci_user', ['ci_params', 'ci_http', 'ci_config', 'ci_call2api'])
    .factory('userSrv', ['$q', 'configSrv', 'httpSrv', '$rootScope', '$location', 'paramsSrv', 'call2ApiSrv',
      function($q, configSrv, httpSrv, $rootScope, $location, paramsSrv, call2ApiSrv) {

        var self = {};
        self.userData = false;
        self.params = false;

        /**
         * @name getUserData
         * @description Gets current UserName and SessionId
         *              and returns user infromation and accounts
         * @return {Object}
         */
        self.getUserData = function() {
          var deferred = $q.defer();
          if (self.userData == false) {
            call2ApiSrv.makeGetSignCall('UserAccount/ClientAndTradingAccount', {}, 'json').then(function(response) {
              self.userData = response;
              $rootScope.$broadcast('UserSrv::ready');
              deferred.resolve(self.userData);
            }, function(response) {
              deferred.reject(response);
            });
          } else {
            deferred.resolve(self.userData);
          }
          return deferred.promise;
        };


        /**
         * @name srvUrl
         * @description Generic function to make a http POST call obtaining the
         *    url from the config srv and then another call to a path provided
         * @param path {String}
         * @returns {*}
         */
        function getSrvUrl(path) {
          return configSrv.getKeyValue('SrvUrl').then(function(baseUrl) {
            return httpSrv.get(baseUrl + path, {
              responseType: 'json'
            });
          });
        }


        /**
         * @name getUsernameAndSession
         * @description Gets the username and session of the current user.
         * @returns {*}
         */
        self.getUsernameAndSession = function() {
          return {
            username: paramsSrv.UN || paramsSrv.TA || paramsSrv.CLC || '',
            session:  paramsSrv.SN || ''
          };
        };


        /**
         * @name initSessionParameter
         * @description Sets the Session, UN, TA for the current session.
         */
        self.initSessionParameter = function(_update) {
          var params = $location.search();
          if (!self.params || _update) {
            var username = paramsSrv.UN || paramsSrv.TA || paramsSrv.CLC || '';
            var UNFlag = (typeof paramsSrv.UN == 'undefined') ? false : true;
            self.params = {
              Session: paramsSrv.SN || '',
              UserName: username,
              TradingAccount: paramsSrv.TA ? paramsSrv.TA : '',
              UNIsDefined: UNFlag
            };
          }
          return self.params;
        };


        /**
         * @name getSessionParameter
         * @description Gets the Session, UN, TA for the current session.
         */
        self.getSessionParameter = function() {
          return self.params;
        };


        /**
         * @name setSessionParameter
         * @description Sets the Session, UN, TA for the current session.
         */
        self.setSessionParameter = function(params) {
          if (!self.params) {
            self.params = {};
          }
          angular.forEach(params, function(value, key) {
            self.params[key] = value;
          })
        };


        /**
         * @name updatePassword
         * @description Sets the new password
         * @parameters {String} Old Password, {String} New Password
         */
        self.updatePassword = function(_old,_new){
          var deferred = $q.defer();

          //var username = sessionSrv.getSessionParameter();
          var username = self.getSessionParameter();

          call2ApiSrv.makePostSignCall('session/changePassword',{},{
            'NewPassword': _new,
            'Password': _old,
            'UserName': username.UserName
          }, 'json').then(function(response){
            deferred.resolve(response);
          },function(response){
            deferred.reject(response);
          });

          return deferred.promise;
        }


        /**
         * @name updateEmail
         * @description Sets the new e-mail
         * @parameters {String} New E-mail
         */
        self.updateEmail = function(_new){
          var deferred = $q.defer();

          call2ApiSrv.makePostSignCall('UserAccount/save',{},{
            "personalEmailAddress": _new,
            "personalEmailAddressIsDirty": true
          }, 'json').then(function(response){
            deferred.resolve(response);
          },function(response){
            deferred.reject(response);
          });

          return deferred.promise;
        };
        return self;
      }]);
})();
