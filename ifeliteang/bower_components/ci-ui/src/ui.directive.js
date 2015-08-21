(function() {
  'use strict';


  /**
   * {Module} ci_ui
   * @description Module to handle issues related with UI.
   */
  angular
    .module('ci_ui')

  /**
   * @name ui_themes
   * @typedef {Value}
   * @description List of availables themes.
   */
    .value('ui_defaults', {
      onEvent: 'brandSrv::ready',
      themes: ['light', 'dark'],
      defaultTh: 'dark'
    })


  /**
   * @name ci-ui-theme
   * @typedef {Directive}
   * @description Handle the theme to display.
   */
    .directive('ciUiTheme', [
      'ui_defaults',

      function(uiDefaults) {
        return {
          restrict: 'A',
          scope: {
            event: '@ciUiTheme'
          },
          link: function(scope, dElem) {
            var uiThemes = uiDefaults.themes, brandTheme;

            scope.$on(scope.event || uiDefaults.onEvent, function(e, brandSrv) {
              brandTheme = brandSrv.getTheme();

              // Avoid missing theme
              if (!_.contains(uiThemes, brandTheme)) {
                brandTheme = uiDefaults.defaultTh;
              }

              // Exclude from list
              uiThemes = _.without(uiThemes, brandTheme);
              // Remove unused CSS
              var link = document.getElementsByTagName('link');
              _.each(uiThemes, function(theme2remove) {
                // Get link tag - vanilla for performance
                // Remove all
                _.find(link, function(e) {
                  /* istanbul ignore else */
                  if (e.getAttribute('href').indexOf(theme2remove) > -1) {
                    angular.element(e).remove();
                    /* istanbul ignore next */
                    return true;
                  }
                });
              });

              // Add the class to directive
              dElem.addClass(brandTheme);

              // Show HTML - vanilla for performance
              var html = document.getElementsByTagName('html')[0];
              angular.element(html).removeClass('hidden');
            });
          }
        }
      }
    ])


  /**
   * @name ci-ui-page-title
   * @typedef {Directive}
   * @description Displays the title of the page.
   */
    .directive('ciUiPageTitle', [
      'ui_defaults',

      function(uiDefaults) {
        return {
          restrict: 'A',
          scope: {
            event: '@ciUiPageTitle'
          },
          link: function(scope, elem) {
            scope.$on(scope.event || uiDefaults.onEvent, function(e, brandSrv) {
              elem.html(brandSrv.getPageTitle());
            });
          }
        }
      }
    ])


  /**
   * @name ci-ui-favicon
   * @typedef {Directive}
   * @description Sets up an icon for the page.
   */
    .directive('ciUiFavicon', [
      'ui_defaults',

      function(uiDefaults) {
        return {
          restrict: 'A',
          scope: {
            event: '@ciUiFavicon'
          },
          link: function(scope, elem) {
            scope.$on(scope.event || uiDefaults.onEvent, function(e, brandSrv) {
              elem.attr('href', brandSrv.getFavicon());
            });
          }
        }

      }
    ])


  /**
   * @name ci-ui-logo
   * @typedef {Directive}
   * @description Display a logo.
   */
    .directive('ciUiLogo', [
      function() {
        return {
          restrict: 'A',
          template: '<img ng-src="{{url}}" alt="{{alt}}" />',
          scope: {
            url: '@',
            alt: '@'
          }
        }
      }
    ])


  /**
   * @name ci-ui-dropdown
   * @typedef {Directive}
   * @description Sets up a basis for a dropdown.
   */
    .directive('ciUiDropdown', [

      function() {
        var template = '\
        <div class="btn-group" dropdown> \
          <a href="#" dropdown-toggle id="ci-dropdown-label" class="{{ dd.label.class }}"> \
            <span>{{ dd.label.text }}</span> \
            <span class="caret"></span> \
          </a> \
          <ul class="dropdown-menu" role="menu" aria-labelledby="ci-dropdown-label"> \
            <li role="menuitem" ng-repeat="link in dd.links"> \
              <a href="{{ link[0] }}"><i id="{{ link[2] }}"></i> {{ link[1] }}</a> \
            </li> \
          </ul> \
        </div>';

        return {
          restrict: 'A',
          template: template,
          scope: {
            dd: '=ddModel'
          }
        }
      }
    ]);
})();
