(function() {
  'use strict';

  angular
    .module('DemoApp', ['ci_culture', 'ci_translate'])

    .config(function($translateProvider) {
      $translateProvider
        .useLoader('ciTranslationLoader', { url: 'translations.json' });
    })

    .controller('DemoCtrl', [
      '$scope',
      'cultureSrv',

      function($scope, cultureSrv) {
        $scope.setLang = cultureSrv.setCulture;
      }
    ]);
})();