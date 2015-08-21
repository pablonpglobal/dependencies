(function() {
  'use strict';

  angular
    .module('DemoApp', ['ci_ui'])

    .controller('DemoCtrl', [
      '$rootScope',
      '$timeout',
      '$scope',
      'uiSrv',

      function($rootScope, $timeout, $scope, uiSrv) {
        $scope.ddModel = {
          label: { text: 'Dropdown', class: 'dd__text' },
          links: [
            ['https://google.com', 'Google'],
            ['https://yahoo.com', 'Yahoo']
          ]
        };

        $scope.testModal = function() {
          uiSrv.modal({
            title: 'Modal Title',
            body: 'Lorem Ipsum Body',
            button: 'Close'
          }).show();
        };

        $timeout(function() {
          $rootScope.$broadcast('brandSrv::ready', {
            getTheme: function() { return 'dark' },
            getPageTitle: function() { return 'Test Page Title' },
            getFavicon: function() { return 'favicon.ico' }
          });
        });
      }
    ]);
})();
