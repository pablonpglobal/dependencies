describe(':: sessionSrv ', function() {
  var params, utils;

  beforeEach(module('ci_session', function($provide) {
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


});