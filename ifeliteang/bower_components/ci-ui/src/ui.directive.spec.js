describe('ci_ui :: directive', function () {

  beforeEach(module('ci_ui'));

  var $scope,
    $compile,
    $,
    element,
    brandSrv;

  beforeEach(inject(function (_$rootScope_, _$compile_) {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $ = angular.element;

    brandSrv = {
      getTheme: function() { return 'dark' },
      getPageTitle: function() { return 'Test Page Title' },
      getFavicon: function() { return 'favicon.ico' }
    };
  }));

  describe(':: ci-ui-theme', function() {
    it(':: add class from brandSrv', function() {
      element = $('<div ci-ui-theme="brandSrv::ready"></div>');
      expect(element.hasClass('dark')).toBe(false);

      element = $compile(element)($scope);
      $scope.$broadcast('brandSrv::ready', brandSrv);
      $scope.$apply();

      expect(element.hasClass('dark')).toBe(true);
    });

    it(':: remove unnecessary stylesheets + default event', function() {
      var result,
          links = $(
            '<link rel="stylesheet" href="/#light.css"/>' +
            '<link rel="stylesheet" href="/#dark.css"/>'
          );

      $(document.head).append(links);

      element = $('<div ci-ui-theme></div>');
      element = $compile(element)($scope);
      $scope.$broadcast('brandSrv::ready', brandSrv);
      $scope.$apply();

      result = document.querySelectorAll('link[rel="stylesheet"]');
      expect(result.length).toBe(1);
      expect($(result).attr('href')).toBe('/#dark.css');
    });
  });

  describe(':: ci-ui-page-title', function() {
    it(':: add the title', function() {
      element = $('<title ci-ui-page-title>default</title>');
      expect(element.html()).toBe('default');

      element = $compile(element)($scope);
      $scope.$broadcast('brandSrv::ready', brandSrv);
      $scope.$apply();

      expect(element.html()).toBe('Test Page Title');
    });
  });

  describe(':: ci-ui-favicon', function() {
    it(':: add the favicon', function() {
      element = $(
        '<link rel="icon" type="image/x-icon" ci-ui-favicon/>'
      );
      expect(element.attr('href')).toBe(undefined);

      element = $compile(element)($scope);
      $scope.$broadcast('brandSrv::ready', brandSrv);
      $scope.$apply();

      expect(element.attr('href')).toBe('favicon.ico');
    });
  });
});
