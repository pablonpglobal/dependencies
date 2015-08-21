describe(':: Culture Directive', function() {
  var cultureSrv,
    $compile,
    $scope,
    element,
    cultures;

  beforeEach(module('ci_culture'));

  beforeEach(function() {
    module(function($translateProvider) {
      $translateProvider
        .useLoader('ciTranslationLoader', { url: 'translations.json' });
    });

    inject(function(_$compile_, _cultureSrv_, _$httpBackend_, $rootScope) {
      cultureSrv = _cultureSrv_;
      $compile = _$compile_;
      $scope = $rootScope.$new();
      cultures = window.translateMock.cultureData;

      _$httpBackend_.whenGET('translations.json').respond(200, {});
    })
  });

  describe(':: ci-language-dropdown', function() {
    beforeEach(function() {
      cultureSrv.setCulture('en');
      element = $compile('<div ci-language-dropdown></div>')($scope);
      $scope.$digest();
    });

    it('is defined', function() {
      expect(typeof element).not.toBe(undefined);
    });

    it('has the correct number of elements', function() {
      expect(element.find('option').length).toBe(Object.keys(cultures).length);
    });
  });
});
