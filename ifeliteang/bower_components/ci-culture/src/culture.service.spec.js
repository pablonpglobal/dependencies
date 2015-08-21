describe(':: cultureSrv', function() {
  var cultureSrv,
    translateSrv,
    utilsSrv,
    cultures,
    $rootScope,
    $httpBackend,
    $window;

  beforeEach(module('ci_culture'));

  beforeEach(module(function($provide) {
    $window = {
      location: {
        protocol: 'http:',
        href: 'http://www.test.com',
        pathname: '/',
        search: '?cuid=162'
      },
      navigator: {
        userAgent: 'unknown'
      }
    };
    $location = {
      url: function() {
        return $window.location.href
      },
      search: function() {
        return {
          FOO: 1,
          bar: 'a'
        }
      }
    };

    $provide.value('$window', $window);
    $provide.value('$location', $location);
  }));

  beforeEach(function() {
    module(function($translateProvider) {
      $translateProvider
        .useLoader('ciTranslationLoader', { url: 'translations.json' });
    });

    inject(function(_cultureSrv_, _translateSrv_, _$translate_, _$rootScope_, _$httpBackend_, _utilsSrv_) {
      cultureSrv = _cultureSrv_;
      translateSrv = _translateSrv_;
      $rootScope = _$rootScope_.$new();
      $httpBackend = _$httpBackend_;
      utilsSrv = _utilsSrv_;
      cultures = window.translateMock.cultureData;
      spyOn($rootScope, '$broadcast');

      spyOn(translateSrv, 'setLanguage').and.returnValue({
        then: function(fn) { fn() }
      });

      cultureSrv.setCulture('en');
      $httpBackend.whenGET(/.*\/.*locale.*\.js/).respond(201, {});
    })
  });

  it(':: getTextDirection', function() {
    expect(cultureSrv.getTextDirection()).toBe('leftToRight');
  });

  describe(':: getCultureId()', function() {
    it('is defined', function() {
      expect(typeof cultureSrv.getCultureId).toBe('function');
    });

    it('is a number', function() {
      expect(typeof cultureSrv.getCultureId()).toBe('number');
    });
  });

  describe(':: getCultureCode()', function() {
    var cultureCode;

    it('is defined', function() {
      expect(typeof cultureSrv.getCultureCode).toBe('function');
    });

    it('is a string of length 2', function() {
      cultureCode = cultureSrv.getCultureCode();
      expect(typeof cultureCode).toBe('string');
      expect(cultureCode.length).toBe(2);
    });
  });

  describe(':: setCulture()', function() {
    var cultureCode, newLang = 'es';
    it('check change', function() {
      cultureSrv.setCulture(newLang);
      cultureCode = cultureSrv.getCultureCode();
      expect(cultureCode).toEqual(newLang);
    });
  });

  xdescribe(':: specialCases', function() {
    it(':: cuid queryString', function() {
      // TODO
    });

    it(':: navigator language', function() {
      // TODO
    })
  });
});
