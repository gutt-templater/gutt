/* globals before, describe, it */

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var clearDir = require('clear-dir')
var path = require('path')

var tmpFilesDirPath = path.resolve(__dirname, '../tmp')

var parsePhp = require('./helpers/parse-php').parsePhp

chai.use(chaiAsPromised)
chai.should()

before(function (done) {
  clearDir(tmpFilesDirPath, done)
})

describe ('PHP array functions', function () {
  it ('arr_keys', function () {
    var template =
      '{ keys = arr_keys([1, 2, 3, a: 5, "str", [3], "t": 6, a > b, 35: 36]) }' +
      '{ for (key, keys) }' +
      '{ key },' +
      '{ endfor }'

    return parsePhp(template, {a: 4, b: 5}).should.eventually.equal('0,1,2,3,4,5,35,t,')
  })

  it ('arr_contain positive', function () {
    var template =
      '{ result = arr_contain([1, 2, \'a\': 3, 5, 6, 7], 1) }' +
      '{ if (result) }' +
      'found' +
      '{ endif }'

    return parsePhp(template).should.eventually.equal('found')
  })

  it ('arr_contain negative', function () {
    var template =
      '{ result = arr_contain([1, 2, 3, 5, 6, 7], 0) }' +
      '{ if (result) }' +
      'found' +
      '{ endif }'

    return parsePhp(template).should.eventually.equal('')
  })

  it ('arr_values', function () {
    var template =
      '{ result = arr_values([1, 2, \'a\':3, 5, "str", 12:6, 7]) }' +
      '{ for (item, result) }' +
      '{ item },' +
      '{ endfor }'

    return parsePhp(template).should.eventually.equal('1,2,5,str,7,6,3,')
  })

  it ('arr_len equal zero', function () {
    var template =
      '{ result = arr_len([]) }' +
      '{ result }'

    return parsePhp(template).should.eventually.equal('0')
  })

  it ('arr_len not equal zero', function () {
    var template =
      '{ result = arr_len([1, 2, \'a\':3, 5, "str", 12:6, 7]) }' +
      '{ result }'

    return parsePhp(template).should.eventually.equal('7')
  })

  it ('arr_push', function () {
    var template =
      '{ a = [1, 2, 3, 5, "str", 6, 7] }' +
      '{ arr_push(a, 10) }' +
      '{ arr_len(a) }' +
      '{ a[6] }'

    return parsePhp(template).should.eventually.equal('87')
  })

  it ('arr_unshift', function () {
    var template =
      '{ a = [1, 2, 3, 5, "str", 6, 7] }' +
      '{ arr_unshift(a, 10) }' +
      '{ arr_len(a) }' +
      '{ a[0] }'

    return parsePhp(template).should.eventually.equal('810')
  })

  it ('arr_pop', function () {
    var template =
      '{ a = [1, 2, 3, 5, "str", 6, 7] }' +
      '{ arr_pop(a) }' +
      '{ arr_len(a) }'

    return parsePhp(template).should.eventually.equal('76')
  })

  it ('arr_shift', function () {
    var template =
      '{ a = [1, 2, 3, 5, "str", 6, 7] }' +
      '{ arr_shift(a) }' +
      '{ arr_len(a) }'

    return parsePhp(template).should.eventually.equal('16')
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

    return parsePhp(template).should.eventually.equal('contain')
  })

  it ('arr_slice', function () {
    var template =
      '{ a = [1, 2, 3, 4, 5, 6, 7, 8] }' +
      '{ subarr = arr_slice(a, 3 ,3) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }' +
      '{ arr_len(a) }'

    return parsePhp(template).should.eventually.equal('4,5,6,8')
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

    return parsePhp(template).should.eventually.equal('4,5,6,-1,2,3,1,2,3,4,7,8,')
  })

  it ('arr_pad positive', function () {
    var template =
      '{ subarr = arr_pad([1, 2, 3], 7, 9) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }'

    return parsePhp(template).should.eventually.equal('1,2,3,9,9,9,9,')
  })

  it ('arr_pad negative', function () {
    var template =
      '{ subarr = arr_pad([1, 2, 3], -7, 9) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }'

    return parsePhp(template).should.eventually.equal('9,9,9,9,1,2,3,')
  })

  it ('arr_pad keep origin', function () {
    var template =
      '{ subarr = arr_pad([1, 2, 3], -3, 9) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }'

    return parsePhp(template).should.eventually.equal('1,2,3,')
  })

  it ('arr_pad keep origin', function () {
    var template =
      '{ subarr = arr_pad([1, 2, 3], 3, 9) }' +
      '{ for (item, subarr) }' +
      '{ item },' +
      '{ endfor }'

    return parsePhp(template).should.eventually.equal('1,2,3,')
  })

  it ('arr_reverse', function () {
    var template =
      '{ reversed = arr_reverse([1, 2, 3]) }' +
      '{ for (item, reversed) }' +
      '{ item },' +
      '{ endfor }'

    return parsePhp(template).should.eventually.equal('3,2,1,')
  })

  it ('arr_unique', function () {
    var template =
      '{ unique = arr_unique([1, 2, 3, 2, 1, 4, 5, 3, 2]) }' +
      '{ for (item, unique) }' +
      '{ item },' +
      '{ endfor }'

    return parsePhp(template).should.eventually.equal('1,2,3,4,5,')
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

    return parsePhp(template).should.eventually.equal('1,1,2,2,2,3,3,4,5,-1,2,3,2,1,4,5,3,2,')
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

    return parsePhp(template).should.eventually.equal('5,4,3,3,2,2,2,1,1,-1,2,3,2,1,4,5,3,2,')
  })

  it ('arr_key', function () {
    var template =
      '{ origin = ["e":1, "c":2, "f":3, "a":2, "b":1, "d":4, "i":5, "h":3, "g":2] }' +
      '{ arr_key(origin, 3) }'

    return parsePhp(template).should.eventually.equal('f')
  })
})
