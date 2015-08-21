describe('factory: Logger', function() {
  var params, utils;

  beforeEach(module('ci_params', function($provide) {
    utils = {};

    utils.location = function() {
      return {
        queryString: function() {
          return {
            A: 1,
            B: 2
          };
        }
      }
    };

    $provide.value('utilsSrv', utils);
  }));

  beforeEach(inject(function(_paramsSrv_) {
    params = _paramsSrv_;
  }));

  it('Test if the Parameter has a value', function() {
    expect(params.A).toBe(1);
    expect(params.B).toBe(2);
  });
});