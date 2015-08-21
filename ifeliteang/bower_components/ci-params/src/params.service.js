(function() {
  'use strict';

  /**
   * {Factory} paramsSrv
   * @fileOverview Retrieve the params
   */
  angular
    .module('ci_params', ['ci_utils'])
    .factory('paramsSrv', [
      'utilsSrv',
      function(utilsSrv) {
        var self = {};

        init();
        /**
         * @name init
         * @description Sets up the params
         */
        function init() {
          _.each(utilsSrv.location().queryString(), function(value, key) {
            self[key.toUpperCase()] = value;
          });
        }

        return self;
      }
    ]);
})();
