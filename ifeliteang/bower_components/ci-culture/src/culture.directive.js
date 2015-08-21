(function() {
  'use strict';

  /**
   * {Directive} ci_culture
   * @fileOverview Sets up the culture and direction of the text.
   */
  angular
    .module('ci_culture')

    .run(function($templateCache) {
      var template = '\
      <div class="language-select" ng-if="visible"> \
        <label> \
          <select ng-model="currentLang" \
                  ng-options="lang.code as lang.name for lang in languages" \
                  ng-change="changeCulture(currentLang)"></select> \
        </label> \
      </div>';

      $templateCache.put('translate.directive.html', template);
    })


  /**
   * @name ci-language-dropdown
   * @typedef {Directive}
   * @description Combo element to change the language.
   */
    .directive('ciLanguageDropdown', [
      'cultureSrv',
      function(cultureSrv) {
        return {
          restrict: 'A',
          templateUrl: 'translate.directive.html',
          link: function(scope) {
            scope.currentLang = cultureSrv.getCultureCode();
            scope.languages = cultureSrv.getCultures();
            scope.visible = _.keys(scope.languages).length > 1;
            scope.changeCulture = cultureSrv.setCulture;

            scope.$on('cultureSrv::ready', function() {
              scope.currentLang = cultureSrv.getCultureCode();
            });
          }
        }
      }
    ])


  /**
   * @name culture
   * @typedef {Directive}
   * @description Change the text direction among different cultures
   */
    .directive('culture', [
      function() {
        return {
          restrict: 'A',
          link: function(scope, element) {
            scope.$on('cultureSrv::ready', function(evt, culture) {
              element
                .removeClass('leftToRight')
                .removeClass('rightToLeft')
                .addClass(culture.textDirection);
            });
          }
        }
      }
    ]);
})();