/**
 @fileoverview Unit testing for the brands settings for the login.
 @author Agustin Diaz
 */
'use strict';
describe('Service :: Brand', function() {
  beforeEach(module('ci_brands'));
  describe(':: Env param', function() {
    var httpBackend, injector;
    beforeEach(inject(function($injector, $httpBackend) {
      httpBackend = $httpBackend;
      injector = $injector;
      $httpBackend.whenGET(/.*\/brands\.json.*/)
          .respond({
            'cityindexlite': {
              "defaultTheme": "dark",
              "logo": "urllogo"
            },
            'barclayslite': {
              "defaultTheme": "light",
              "logo": "urllogo"
            },
            'default': {
              "defaultTheme": "light",
              "logo": "urllogo"
            }
          });
    }));

    it(':: With an incorrect brand should load default', function() {
      var service = injector.get('brandSrv');
      var brand;
      service.getBrand('notabrand').then(function(_brand) {
        brand = _brand;
        expect(brand.brandName).toBe('default');
      });
      httpBackend.flush();
    })

    it(':: With a correct brand', function() {
      var service = injector.get('brandSrv');
      var brand;
      service.getBrand('cityindexlite').then(function(_brand) {
        brand = _brand;
        expect(brand.defaultTheme).toBeTruthy();
      });
      var theme = service.getTheme();
      expect(theme).toBe('dark');
      httpBackend.flush();
    })

    it(':: Checking if the brand has every property', function() {
      var service = injector.get('brandSrv');
      var brand;
      service.getBrand('cityindexlite').then(function(_brand) {
        brand = _brand;
        expect(Object.keys(brand).length).toBe(2);
      });
      httpBackend.flush();
    })

  })
});

