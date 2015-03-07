
(function() {
  'use strict';
  describe('Service: Autocomplete', function() {
    var Autocomplete;
    beforeEach(module('jpeopleApp'));
    Autocomplete = {};
    beforeEach(inject(function(_Autocomplete_) {
      return Autocomplete = _Autocomplete_;
    }));
    return it('should do something', function() {
      return expect(!!Autocomplete).toBe(true);
    });
  });

}).call(this);
