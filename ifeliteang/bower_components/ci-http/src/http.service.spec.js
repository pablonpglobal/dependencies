describe(':: httpSrv ', function() {
  var http, utils;

  beforeEach(module('ci_http', function($provide) {
    utils = {};

    utils.isBrowser = function(a, b) {
      return false;
    };

    $provide.value('utilsSrv', utils);
  }));

  beforeEach(inject(function(_httpSrv_, _$httpBackend_) {
    http = _httpSrv_;
    $httpBackend = _$httpBackend_;
  }));

  beforeEach(function() {
    $httpBackend.whenGET(/.*\/main\.html.*/).respond('<div></div>');
    $httpBackend.whenGET('/dummyGET/true').respond({ get: true });
    $httpBackend.whenPOST('/dummyPOST/true').respond({ post: true });
  });

  it(':: request() using GET', function() {
    http.request({
      method: 'GET',
      url: '/dummyGET/true'
    }).then(function(res) {
      dummyHttp = res;
    });
    $httpBackend.flush();
    expect(dummyHttp).toEqual({ get: true });
  });

  it(':: request() using POST', function() {
    http.request({
      method: 'POST',
      url: '/dummyPOST/true',
      responseType: 'json'
    }).then(function(res) {
      dummyHttp = res;
    });
    $httpBackend.flush();
    expect(dummyHttp).toEqual({ post: true });
  });

  it(':: get()', function() {
    http.get('/dummyGET/true').then(function(res) {
      dummyHttp = res;
    });
    $httpBackend.flush();
    expect(dummyHttp).toEqual({ get: true });
  });

  it(':: post()', function() {
    http.post('/dummyPOST/true').then(function(res) {
      dummyHttp = res;
    });
    $httpBackend.flush();
    expect(dummyHttp).toEqual({ post: true });
  });

});


describe(':: httpSrv :: IE8 ', function() {
  var http, utils;

  beforeEach(module('ci_http', function($provide) {
    utils = {};

    if (typeof window == 'undefined') {
      window = {};
    }
    window.XDomainRequest = function() {
          return {
            open: function(method) {
              return method;
            },
            send: function() {
            }
          };
    };

    utils.isBrowser = function(a, b) {
      return b();
    };

    $provide.value('utilsSrv', utils);
    $provide.value('window', window);
  }));

  beforeEach(inject(function(_httpSrv_, _$httpBackend_) {
    http = _httpSrv_;
    $httpBackend = _$httpBackend_;
  }));

  it(':: request() using POST', function() {
    http.request({
      method: 'POST',
      url: '/dummyPOST/true',
      responseType: 'json'
    }).then(function(res) {
      dummyHttp = res;
    });
    expect(dummyHttp).toEqual({ post: true });
  });

  it(':: post()', function() {
    http.post('/dummyPOST/true').then(function(res) {
      dummyHttp = res;
    });
    expect(dummyHttp).toEqual({ post: true });
  });

});