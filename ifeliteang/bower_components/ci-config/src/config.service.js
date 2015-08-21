(function() {
  'use strict';

  /**
   * {Factory} ConfigSrv
   * Service to bring configuration files
   * TODO: Set up the constants into a separated file
   */
  angular
    .module('ci_config', ['ci_utils', 'ci_params'])
    .factory('configSrv', ['$http', '$q', 'utilsSrv', 'paramsSrv',
      function($http, $q, UtilsSrv, ParamsSrv) {
      var self = {
          map: {}
        },
        ready = false,
        pending = [],
        envStr;
        var isIE8 = false;

        UtilsSrv.isBrowser(function(name, version) {
          return name === 'msie' && version <= 8;
        }, function() {
          isIE8 = true;
        });

      // TODO: improve this
      if(ParamsSrv.ENV) {
        ParamsSrv.ENV = (ParamsSrv.ENV == 'live' ? 'PROD-INX' : ParamsSrv.ENV);
        envStr = '_' + ParamsSrv.ENV;
      } else {
        envStr = '';
      }

      getConfig();


      /**
       * @name init
       * @description Loads the configuration, validates the browser and
       *              resolves each pending promises.
       */
      function getConfig() {
        $http.get('./configs/config' + envStr + '.json').success(function(configStr) {
          var config = configStr;
          self.map['SrvUrl'] = config.flexITP.tradingApiURL;
          self.map['lsServerUrl'] = config.flexITP.lsc.serverURL;
          self.map['forgotPasswordURL'] = config.flexITP.forgotPasswordURL;
          ready = true;
          _.each(pending, function(func) {
            func();
          });
        });
      }


      /**
       * @name getKeyValue
       * @description If config file is loaded returns a promise which will
       *              resolve the value if found
       * @param key {String} Key for the xml to bring the correct value
       * @returns {Object} A promise
       */
      self.getKeyValue = function(key) {
        var deferred = $q.defer();
        if(!ready) {
          pending.push(function() {
            deferred.resolve(self.map[key]);
          });
        } else {
          deferred.resolve(self.map[key]);
        }
        return deferred.promise;
      };

      return self;
    }]);
})();
