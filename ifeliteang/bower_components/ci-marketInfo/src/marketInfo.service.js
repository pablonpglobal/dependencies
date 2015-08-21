(function() {
  'use strict';

  /**
   * {Factory} UserSrv
   * @fileOverview User info handler
   */
  angular
    .module('ci_marketInfo', ['ci_call2api'])
    .factory('marketInfoSrv', [
      '$q', 'call2ApiSrv',
      function($q, call2ApiSrv) {

        var self = {
          MarketIds : []
        };


        /**
         * @name getInfo function
         * @description Call retrieves market info.
         * @return {promise}
         */
        self.getInfo = function(marketId) {
          var deferred = $q.defer();
          call2ApiSrv.makePostSignCall('market/information', {}, {
            MarketIds: [marketId + ""]
          }).then(function(data) {
            self.market = data.MarketInformation;
            deferred.resolve(data.MarketInformation[0] || false);
          }, function(error) {
            deferred.reject(error);
          });
          return deferred.promise;
        };


        /**
         * @name getMarket function
         * @description Current Market Information.
         * @returns {Object}
         */
        self.getMarket = function() {
          return self.market;
        };


        /**
         * @name addMarketInfoId
         * @description Adds a market id to an array of market ids.
         * @param {Number} marketId
         */
        self.addMarketInfoId = function(marketId) {
          if (_.indexOf(self.MarketIds, marketId) == -1) {
            self.MarketIds.push(marketId);
          }
        };


        /**
         * @name getMarketInfoIds
         * @description Gets an array of market ids.
         * @returns {Array}
         */
        self.getMarketInfoIds = function() {
          return self.MarketIds;
        };


        /**
         * @name setInfo
         * @description Save market info.
         * @param  {object} marketInfo
         * @return {promise}
         */
        self.setInfo = function(marketInfo) {
          var deferred = $q.defer();
          call2ApiSrv.makePostSignCall('market/information/save', {}, marketInfo)
            .then(function(data) {
              deferred.resolve();
            }, function(error) {
              deferred.reject(error);
            });
          return deferred.promise;
        }

        return self;
      }
    ]);
})();
