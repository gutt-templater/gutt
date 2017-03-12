/* globals describe, it */

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var parsePhp = require('./helpers/parse-php').parsePhp

chai.use(chaiAsPromised)
chai.should()

describe ('PHP array functions', function () {
  it ('arr_keys', function () {
    var template =
      '<component>' +
      '<variable name={keys} value={arr_keys([1, 2, 3, \'a\': 5, "str", [3], "t": 6, a > b, 35: 36]) } />' +
      '<for-each item={key} from={keys}>' +
      '{ key },' +
      '</for-each>' +
      '</component>'

    return parsePhp(template, {a: 4, b: 5}).should.eventually.equal('0,1,2,3,4,5,35,a,t,')
  })

  it ('arr_contain positive', function () {
    var template =
      '<component>' +
      '<variable name={result} value={arr_contain([1, 2, \'a\': 3, 5, 6, 7], 1)} />' +
      '<if test={result}>' +
      'found' +
      '</if>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('found')
  })

  it ('arr_contain negative', function () {
    var template =
      '<component>' +
      '<variable name={result} value={arr_contain([1, 2, 3, 5, 6, 7], 0)} />' +
      '<if test={result}>' +
      'found' +
      '</if>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('')
  })

  it ('arr_values', function () {
    var template =
      '<component>' +
      '<variable name={result} value={arr_values([1, 2, \'a\':3, 5, "str", 12:6, 7])} />' +
      '<for-each item={item} from={result}>' +
      '{ item },' +
      '</for-each>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('1,2,5,str,7,6,3,')
  })

  it ('arr_len equal zero', function () {
    var template =
      '<component>' +
      '<variable name={result} value={arr_len([])} />' +
      '{ result }' +
      '</component>'

    return parsePhp(template).should.eventually.equal('0')
  })

  it ('arr_len not equal zero', function () {
    var template =
      '<component>' +
      '<variable name={result} value={arr_len([1, 2, \'a\':3, 5, "str", 12:6, 7])} />' +
      '{ result }' +
      '</component>'

    return parsePhp(template).should.eventually.equal('7')
  })

  it ('arr_push', function () {
    var template =
      '<component>' +
      '<variable name={a} value={[1, 2, 3, 5, "str", 6, 7]} />' +
      '{ arr_push(a, 10) }' +
      '{ arr_len(a) }' +
      '{ a[6] }' +
      '</component>'

    return parsePhp(template).should.eventually.equal('87')
  })

  it ('arr_unshift', function () {
    var template =
      '<component>' +
      '<variable name={a} value={[1, 2, 3, 5, "str", 6, 7] } />' +
      '{ arr_unshift(a, 10) }' +
      '{ arr_len(a) }' +
      '{ a[0] }' +
      '</component>'

    return parsePhp(template).should.eventually.equal('810')
  })

  it ('arr_pop', function () {
    var template =
      '<component>' +
      '<variable name={a} value={[1, 2, 3, 5, "str", 6, 7] } />' +
      '{ arr_pop(a) }' +
      '{ arr_len(a) }' +
      '</component>'

    return parsePhp(template).should.eventually.equal('76')
  })

  it ('arr_shift', function () {
    var template =
      '<component>' +
      '<variable name={a} value={[1, 2, 3, 5, "str", 6, 7] } />' +
      '{ arr_shift(a) }' +
      '{ arr_len(a) }' +
      '</component>'

    return parsePhp(template).should.eventually.equal('16')
  })

  it ('arr_rand', function () {
    var template =
      '<component>' +
      '<variable name={a} value={[1, 3, 5, 7, 9, 11, 13] } />' +
      '<variable name={ b} value={ arr_rand(a) } />' +
      '<switch>' +
      '<case test={arr_contain(a, b) }>' +
      'contain' +
      '</case>' +
      '<default>' +
      '{ b }' +
      '</default>' +
      '</switch>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('contain')
  })

  it ('arr_slice', function () {
    var template =
      '<component>' +
      '<variable name={a} value={ [1, 2, 3, 4, 5, 6, 7, 8] } />' +
      '<variable name={subarr} value={ arr_slice(a, 3 ,3) } />' +
      '<for-each item={item} from={subarr}>' +
      '{ item },' +
      '</for-each>' +
      '{ arr_len(a) }' +
      '</component>'

    return parsePhp(template).should.eventually.equal('4,5,6,8')
  })

  it ('arr_splice', function () {
    var template =
      '<component>' +
      '<variable name={ a} value={ [1, 2, 3, 4, 5, 6, 7, 8] } />' +
      '<variable name={ subarr} value={ arr_splice(a, 3, 3, [1, 2, 3, 4]) } />' +
      '< for-each item={item} from={subarr}>' +
      '{ item },' +
      '</ for-each >' +
      '-' +
      '< for-each item={item} from={a}>' +
      '{ item },' +
      '</ for-each>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('4,5,6,-1,2,3,1,2,3,4,7,8,')
  })

  it ('arr_pad positive', function () {
    var template =
      '<component><variable name={subarr} value={ arr_pad([1, 2, 3], 7, 9) } />' +
      '<for-each item={item} from={ (subarr) } >' +
      '{ item },' +
      '< /for-each></component>'

    return parsePhp(template).should.eventually.equal('1,2,3,9,9,9,9,')
  })

  it ('arr_pad negative', function () {
    var template =
      '<component>' +
      '<variable name={ subarr} value={arr_pad([1, 2, 3], -7, 9) } />' +
      '<for-each item={item} from={subarr}>' +
      '{ item },' +
      '</for-each>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('9,9,9,9,1,2,3,')
  })

  it ('arr_pad keep origin', function () {
    var template =
      '<component>' +
      '<variable name={ subarr } value={arr_pad([1, 2, 3], -3, 9) } />' +
      '<for-each item={item} from={ subarr } >' +
      '{ item },' +
      '</for-each>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('1,2,3,')
  })

  it ('arr_pad keep origin', function () {
    var template =
      '<component>' +
      '<variable name={ subarr}  value={ arr_pad([1, 2, 3], 3, 9) } />' +
      '<for-each item={item} from={subarr}>' +
      '{ item },' +
      '</for-each>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('1,2,3,')
  })

  it ('arr_reverse', function () {
    var template =
      '<component>' +
      '<variable name={ reversed}  value={arr_reverse([1, 2, 3]) } />' +
      '<for-each item={item} from={reversed}>' +
      '{ item },' +
      '</for-each>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('3,2,1,')
  })

  it ('arr_unique', function () {
    var template =
      '<component>' +
      '<variable name={ unique}  value={arr_unique([1, 2, 3, 2, 1, 4, 5, 3, 2]) } />' +
      '<for-each item={item} from={unique}>' +
      '{ item },' +
      '</for-each>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('1,2,3,4,5,')
  })

  it ('arr_sort', function () {
    var template =
      '<component>' +
      '<variable name={ origin}  value={[1, 2, 3, 2, 1, 4, 5, 3, 2] } />' +
      '<variable name={ sorted}  value={arr_sort(origin) } />' +
      '<for-each item={item} from={sorted}>' +
      '{ item },' +
      '</for-each>' +
      '-' +
      '<for-each item={item} from={origin}>' +
      '{ item },' +
      '</for-each>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('1,1,2,2,2,3,3,4,5,-1,2,3,2,1,4,5,3,2,')
  })

  it ('arr_sort_reverse', function () {
    var template =
      '<component>' +
      '<variable name={ origin}  value={[1, 2, 3, 2, 1, 4, 5, 3, 2] } />' +
      '<variable name={ sorted}  value={arr_sort_reverse(origin) } />' +
      '<for-each item={item} from={sorted}>' +
      '{ item },' +
      '</for-each>' +
      '-' +
      '<for-each item={item} from={origin}>' +
      '{ item },' +
      '</for-each>' +
      '</component>'

    return parsePhp(template).should.eventually.equal('5,4,3,3,2,2,2,1,1,-1,2,3,2,1,4,5,3,2,')
  })

  it ('arr_key', function () {
    var template =
      '<component>' +
      '<variable name={ origin}  value={["e":1, "c":2, "f":3, "a":2, "b":1, "d":4, "i":5, "h":3, "g":2] } />' +
      '{ arr_key(origin, 3) }' +
      '</component>'

    return parsePhp(template).should.eventually.equal('f')
  })
})
