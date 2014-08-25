'use strict'

describe 'Service: Autocomplete', ->

  # load the service's module
  beforeEach module 'jpeopleApp'

  # instantiate service
  Autocomplete = {}
  beforeEach inject (_Autocomplete_) ->
    Autocomplete = _Autocomplete_

  it 'should do something', ->
    expect(!!Autocomplete).toBe true
