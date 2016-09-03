/* globals describe, it */

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var parseJs = require('./helpers/parse-js').parseJs

chai.use(chaiAsPromised)
chai.should()

describe ('JS array functions', function () {
  it ('arr_keys', function () {
    var template =
      '{ keys = arr_keys([1, 2, 3, a: 5, "str", [3], "t": 6, a > b, 35: 36]) }' +
      '{ for (key, keys) }' +
      '{ key },' +
      '{ endfor }'
    var result = [
      {type: 'text', text: '0'},
      {type: 'text', text: ','},
      {type: 'text', text: '1'},
      {type: 'text', text: ','},
      {type: 'text', text: '2'},
      {type: 'text', text: ','},
      {type: 'text', text: '3'},
      {type: 'text', text: ','},
      {type: 'text', text: '4'},
      {type: 'text', text: ','},
      {type: 'text', text: '5'},
      {type: 'text', text: ','},
      {type: 'text', text: '35'},
      {type: 'text', text: ','},
      {type: 'text', text: 't'},
      {type: 'text', text: ','},
    ]

    return parseJs(template, {a: 4, b: 5}).should.eventually.deep.equal(result)
  })

  it ('arr_contain positive', function () {
    var template =
      '{ result = arr_contain([1, 2, \'a\': 3, 5, 6, 7], 1) }' +
      '{ if (result) }' +
      'found' +
      '{ else }' +
      '{ result }' +
      '{ endif }'

    return parseJs(template).should.eventually.deep.equal([{type: 'text', text: 'found'}])
  })

  it ('arr_contain negative', function () {
    var template =
      '{ result = arr_contain([1, 2, 3, 5, 6, 7], 0) }' +
      '{ if (result) }' +
      'found' +
      '{ endif }'

    return parseJs(template).should.eventually.deep.equal([])
  })

  it ('arr_values', function () {
    var template =
      '{ result = arr_values([1, 2, \'a\':3, 5, "str", 12:6, 7]) }' +
      '{ for (item, result) }' +
      '{ item },' +
      '{ endfor }'
    var result = [
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 5},
      {type: 'text', text: ','},
      {type: 'text', text: 'str'},
      {type: 'text', text: ','},
      {type: 'text', text: 7},
      {type: 'text', text: ','},
      {type: 'text', text: 6},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_len equal zero', function () {
    var template =
      '{ result = arr_len([]) }' +
      '{ result }'

    return parseJs(template).should.eventually.deep.equal([{type: 'text', text: 0}])
  })

  it ('arr_len for array not equal zero', function () {
    var template =
      '{ result = arr_len([1, 2, 3, 5, "str", 6, 7]) }' +
      '{ result }'

    return parseJs(template).should.eventually.deep.equal([{type: 'text', text: 7}])
  })

  it ('arr_len for object not equal zero', function () {
    var template =
      '{ result = arr_len([1, 2, \'a\':3, 5, "str", 12:6, 7]) }' +
      '{ result }'

    return parseJs(template).should.eventually.deep.equal([{type: 'text', text: 7}])
  })

  it ('arr_push', function () {
    var template =
      '{ a = [1, 2, 3, 5, "str", 6, 7] }' +
      '{ arr_push(a, 10) }' +
      '{ arr_len(a) }' +
      '{ a[6] }'
    var result = [
      {type: 'text', text: ''},
      {type: 'text', text: 8},
      {type: 'text', text: 7}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_unshift', function () {
    var template =
      '{ a = [1, 2, 3, 5, "str", 6, 7] }' +
      '{ arr_unshift(a, 10) }' +
      '{ arr_len(a) }' +
      '{ a[0] }'
    var result = [
      {type: 'text', text: ''},
      {type: 'text', text: 8},
      {type: 'text', text: 10}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_pop', function () {
    var template =
      '{ a = [1, 2, 3, 5, "str", 6, 7] }' +
      '{ arr_pop(a) }' +
      '{ arr_len(a) }'
    var result = [
      {type: 'text', text: 7},
      {type: 'text', text: 6}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_shift', function () {
    var template =
      '{ a = [1, 2, 3, 5, "str", 6, 7] }' +
      '{ arr_shift(a) }' +
      '{ arr_len(a) }'
    var result = [
      {type: 'text', text: 1},
      {type: 'text', text: 6}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_rand', function () {
    var template =
      '{ a = [1, 3, 5, 7, 9, 11, 13] }' +
      '{ b = arr_rand(a) }' +
      '{ if (arr_contain(a, b)) }' +
      'contain' +
      '{ else }' +
      '{ b }' +
      '{ endif }'

    return parseJs(template).should.eventually.deep.equal([{type: 'text', text: 'contain'}])
  })

  it ('arr_slice', function () {
    var template =
      '{ a = [1, 2, 3, 4, 5, 6, 7, 8] }' +
      '{ subarr = arr_slice(a, 3 ,3) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }' +
      '{ arr_len(a) }'
    var result = [
      {type: 'text', text: 4},
      {type: 'text', text: ','},
      {type: 'text', text: 5},
      {type: 'text', text: ','},
      {type: 'text', text: 6},
      {type: 'text', text: ','},
      {type: 'text', text: 8}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_splice', function () {
    var template =
      '{ a = [1, 2, 3, 4, 5, 6, 7, 8] }' +
      '{ subarr = arr_splice(a, 3, 3, [1, 2, 3, 4]) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }' +
      '-' +
      '{ for (item, a) }' +
      '{ item },' +
      '{ endfor }'
    var result = [
      {type: 'text', text: 4},
      {type: 'text', text: ','},
      {type: 'text', text: 5},
      {type: 'text', text: ','},
      {type: 'text', text: 6},
      {type: 'text', text: ','},
      {type: 'text', text: '-'},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 4},
      {type: 'text', text: ','},
      {type: 'text', text: 7},
      {type: 'text', text: ','},
      {type: 'text', text: 8},
      {type: 'text', text: ','}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_pad positive', function () {
    var template =
      '{ arr = [1, 2, 3] }' +
      '{ subarr = arr_pad(arr, 7, 9) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }' +
      '{ arr_len(arr) }'
    var result = [
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 9},
      {type: 'text', text: ','},
      {type: 'text', text: 9},
      {type: 'text', text: ','},
      {type: 'text', text: 9},
      {type: 'text', text: ','},
      {type: 'text', text: 9},
      {type: 'text', text: ','},
      {type: 'text', text: 3}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_pad negative', function () {
    var template =
      '{ arr = [1, 2, 3] }' +
      '{ subarr = arr_pad(arr, -7, 9) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }' +
      '{ arr_len(arr) }'
    var result = [
      {type: 'text', text: 9},
      {type: 'text', text: ','},
      {type: 'text', text: 9},
      {type: 'text', text: ','},
      {type: 'text', text: 9},
      {type: 'text', text: ','},
      {type: 'text', text: 9},
      {type: 'text', text: ','},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 3}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_pad keep origin', function () {
    var template =
      '{ subarr = arr_pad([1, 2, 3], -3, 9) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }'
    var result = [
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_pad keep origin', function () {
    var template =
      '{ subarr = arr_pad([1, 2, 3], 3, 9) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }'
    var result = [
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_reverse', function () {
    var template =
      '{ origin = [1, 2, 3] }' +
      '{ reversed = arr_reverse(origin) }' +
      '{ for (item, reversed) }' +
      '{ item },' +
      '{ endfor }' +
      '{ for (item, origin) }' +
      '{ item },' +
      '{ endfor }'
    var result = [
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_unique', function () {
    var template =
      '{ unique = arr_unique([1, 2, 3, 2, 1, 4, 5, 3, 2]) }' +
      '{ for (item, unique) }' +
      '{ item },' +
      '{ endfor }'
    var result = [
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 4},
      {type: 'text', text: ','},
      {type: 'text', text: 5},
      {type: 'text', text: ','}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_sort', function () {
    var template =
      '{ origin = [1, 2, 3, 2, 1, 4, 5, 3, 2] }' +
      '{ sorted = arr_sort(origin) }' +
      '{ for (item, sorted) }' +
      '{ item },' +
      '{ endfor }' +
      '-' +
      '{ for (item, origin) }' +
      '{ item },' +
      '{ endfor }'
    var result = [
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 4},
      {type: 'text', text: ','},
      {type: 'text', text: 5},
      {type: 'text', text: ','},
      {type: 'text', text: '-'},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 4},
      {type: 'text', text: ','},
      {type: 'text', text: 5},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_sort_reverse', function () {
    var template =
      '{ origin = [1, 2, 3, 2, 1, 4, 5, 3, 2] }' +
      '{ sorted = arr_sort_reverse(origin) }' +
      '{ for (item, sorted) }' +
      '{ item },' +
      '{ endfor }' +
      '-' +
      '{ for (item, origin) }' +
      '{ item },' +
      '{ endfor }'
    var result = [
      {type: 'text', text: 5},
      {type: 'text', text: ','},
      {type: 'text', text: 4},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: '-'},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','},
      {type: 'text', text: 1},
      {type: 'text', text: ','},
      {type: 'text', text: 4},
      {type: 'text', text: ','},
      {type: 'text', text: 5},
      {type: 'text', text: ','},
      {type: 'text', text: 3},
      {type: 'text', text: ','},
      {type: 'text', text: 2},
      {type: 'text', text: ','}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('arr_key', function () {
    var template =
      '{ origin = ["e":1, "c":2, "f":3, "a":2, "b":1, "d":4, "i":5, "h":3, "g":2] }' +
      '{ arr_key(origin, 2) }'

    return parseJs(template).should.eventually.deep.equal([{type: 'text', text: 'c'}])
  })
})
