(function() {
  'use strict';

  /**
   * {Factory} uiSrv
   * @fileOverview Service for UI
   */
  angular
    .module('ci_ui', [
      'ui.bootstrap'
    ])


    .run(function($templateCache) {
      var template = ' \
      <div ng-class="[params.type, \'defaultModal\']"> \
        <div class="modal-header"> \
          <h3 class="modal-title">{{ params.title }}</h3> \
        </div> \
        <div class="modal-body"> \
          <p>{{ params.body }}</p> \
          <div class="text-center"> \
            <button class="btn btn-primary" ng-click="params.close()"> \
              {{ params.button }} \
            </button> \
          </div> \
        </div> \
      </div>';

      $templateCache.put('modal.ui.service.html', template);
    })


  /**
   * @name uiSrv
   * @typedef {Factory}
   * @description Core service
   */
    .factory('uiSrv', [
      '$modal',

      function($modal) {

        var self = {},
          modalInstance;

        init();
        /**
         * @name init
         * @description Trigger initial.
         */
        function init() {
          // Instantiate modal
          modalInstance = $modal;
        }


        /**
         * @name modal
         * @description Handle $modal issues
         * @param params {Object} Variables configure the HTML.
         * @returns {{show: Function, close: Function}}
         */
        self.modal = function(params) {
          params = params || {};

          var modalConfig = {
            templateUrl: 'modal.ui.service.html',
            size: params.size || 'md',
            controller: [
              '$scope', '$modalInstance',
              function($mScope, $mInstance) {
                $mScope.params = params;
                $mScope.params.close = modalInstance.close = $mInstance.close;
              }
            ]
          };

          return {
            show: function() {
              modalInstance.open(modalConfig);
            },

            close: function() {
              modalInstance.close();
            }
          }
        };

        return self;
      }
    ]);
})();
