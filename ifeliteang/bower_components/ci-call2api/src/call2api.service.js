(function() {
  'use strict';

  /**
   * {Factory} call2ApiSrv
   * @fileOverview Make calls to the API.
   */
  angular
      .module('ci_call2api', ['ci_culture', 'ci_config', 'ci_http', 'ci_params', 'ci_session'])
      .factory('call2ApiSrv', [
        '$q', '$http', '$location', '$window', 'configSrv', 'cultureSrv', 'httpSrv', 'paramsSrv', 'sessionSrv',
        function($q, $http, $location, $window, configSrv, cultureSrv, httpSrv, paramsSrv, sessionSrv) {
          var self = {},
              srvReady = false;

          /**
           * @name extendSignParams
           * @description Add session arguments to params
           *
           * @param  {object} _params Custom params
           * @return {object}         Custom params with session arguments
           */
          function extendSignParams(_params) {
            return angular.extend({}, sessionSrv.getSessionParameter(), _params);
          }


          /**
           * @name makeSignCall
           * @description Make request to service with params and payload
           *
           * @param  {string} _method Mathod for call. Ej, POST,GET
           * @param  {string} _path   Path of service
           * @param  {object} _params URL params
           * @param  {object} _data   Payload data
           * @return {promise}        Promise of request
           */
          function makeSignCall(_method, _path, _params, _data, type) {
            var deferred = $q.defer();
            if (!type) {
              type = 'json';
            }
            _params.cultureId = cultureSrv.getCultureId();
            configSrv.getKeyValue('SrvUrl').then(function(_base){
              httpSrv.request({
                method: _method,
                url: _base + _path,
                params: extendSignParams(_params),
                data: _data,
                responseType: type
              }).then(function(data){
                deferred.resolve(data);
              }, function(data){
                deferred.reject(data);
              });
            });
            return deferred.promise;
          }


          /**
           * @name makeDirectSignCall
           * @description Make request to service with params and payload
           *    without the session params.
           *
           * @param  {string} _method Mathod for call. Ej, POST,GET
           * @param  {string} _path   Path of service
           * @param  {object} _params URL params
           * @param  {object} _data   Payload data
           * @return {promise}        Promise of request
           */
          function makeDirectSignCall(_method, _path, _params, _data, type) {
            var deferred = $q.defer();
            if (!type) {
              type = 'json';
            }
            configSrv.getKeyValue('SrvUrl').then(function(_base){
              httpSrv.request({
                method: _method,
                url: _base + _path,
                params: _params,
                data: _data,
                responseType: type
              }).then(function(data){
                deferred.resolve(data);
              }, function(data){
                deferred.reject(data);
              });
            });
            return deferred.promise;
          }


          /**
           * @name makeGetSignCall
           * @description Make GET call to service.
           *
           * @param  {string} _path   Relative path
           * @param  {object} _params Parameters
           * @param  {string} type json or xml
           * @return {promise}      Promise
           */
          self.makeGetSignCall = function(_path, _params, type) {
            return self.updateSessionParams().then(function() {
              return makeSignCall('GET', _path, _params, {}, type);
            });
          };


          /**
           * @name makePostSignCall
           * @description Make POST request
           *
           * @param  {string} _path   Relative path
           * @param  {object} _params Parameters
           * @param  {object} _data   Payload data
           * @param  {string} type json or xml
           * @return {promise}        Promise
           */
          self.makePostSignCall = function(_path, _params, _data, type) {
            return self.updateSessionParams().then(function() {
              return makeSignCall('POST', _path, _params, _data, type);
            });
          };


          /**
           * @name updateSessionParams
           * @description Update the session information using the API.
           *
           * @return {promise}        Promise
           */
          self.updateSessionParams = function() {
            var deferred = $q.defer();
            if (srvReady) {
              deferred.resolve(paramsSrv.CLC);
            } else {
              var params = {
                'clientAccountId': paramsSrv.CLC,
                'SessionId': paramsSrv.SN,
                'ts': ''
              };

              /*
               * We need to see if the CLC is a client id or a Trading Account Code.
               * In case the response of this call is null or was rejected with a 401
               * error the CLC is really a TA and no change needs to be done.
               * In case it returns something a different value for TAC and Username then it was
               * a valid CLC and we should use the TAC returned by the call.
               * In case it returns and empty TAC with a valid Username or the same value for
               * TAC and Username then we need to make another call to obtain a valid TAC.
               */
              if (paramsSrv.CLC) {
                makeDirectSignCall('GET', 'UserAccount/userName', params, {}, 'json')
                  .then(function(res) {
                    if(res) {
                      if ( (res.TradingAccountCode == res.Username && res.Username != null)
                        || (!res.TradingAccountCode && res.Username)) {
                        makeDirectSignCall('GET', 'UserAccount/ClientAndTradingAccount', {
                          'UserName': res.Username,
                          'Session': paramsSrv.SN
                        }, {}, 'json')
                          .then(function(data) {
                            if (typeof data.TradingAccounts == 'object') {
                              paramsSrv.CLC = data.ClientAccountId;
                              paramsSrv.TA =
                                data.TradingAccounts[0].TradingAccountCode;
                              paramsSrv.UN = res.Username;
                              sessionSrv.getSessionParameter(true);

                            }
                            srvReady = true;
                            deferred.resolve(data.TradingAccounts[0].TradingAccountCode);
                          });
                      } else {
                        paramsSrv.TA = (res.TradingAccountCode != null ? res.TradingAccountCode : paramsSrv.TA);
                        paramsSrv.UN = res.Username || paramsSrv.UN;
                        sessionSrv.getSessionParameter(true);
                        srvReady = true;
                        deferred.resolve(res.TradingAccountCode);
                      }
                    } else {
                      if (sessionSrv.params) {
                        sessionSrv.params.TradingAccount = paramsSrv.CLC;
                      }
                      srvReady = true;
                      deferred.resolve(paramsSrv.CLC);
                    }
                  });
              } else {
                if(!paramsSrv.CLC && paramsSrv.UN) {
                  makeDirectSignCall('GET', 'UserAccount/ClientAndTradingAccount', {
                    'UserName': paramsSrv.UN,
                    'Session': paramsSrv.SN
                  }, {}, 'json').then(function(data) {
                    if (typeof data.TradingAccounts == 'object') {
                      paramsSrv.CLC = data.ClientAccountId;
                      paramsSrv.TA =
                        data.TradingAccounts[0].TradingAccountCode;
                      paramsSrv.UN = paramsSrv.UN || res.Username;
                      sessionSrv.getSessionParameter(true);
                    }
                    srvReady = true;
                    deferred.resolve(data.TradingAccounts[0].TradingAccountCode);
                  });
                } else {
                  if (sessionSrv.params) {
                    sessionSrv.params.TradingAccount = paramsSrv.CLC;
                  }
                }
                srvReady = true;
                deferred.resolve(paramsSrv.CLC);
              }
            }

            return deferred.promise;
          };


          /**
           * Return public interface
           */
          return self;
        }
      ]);
})();
