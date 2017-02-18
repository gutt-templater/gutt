/* globals describe, it */

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

var parseJs = require('./helpers/parse-js').parseJs

chai.use(chaiAsPromised)
chai.should()

describe ('JS number functions', function () {
  it ('num_int', function () {
    return parseJs('<component>{ num_int(11/3) }</component>').should.eventually.deep.equal([3])
  })

  it ('num_int from string', function () {
    return parseJs('<component>{ num_int(\'123.456\') }</component>').should.eventually.deep.equal([123])
  })

  it ('num_float', function () {
    var template =
      '<component>' +
      '<if test={(num_float(11/3) > 3.6 && num_float(11/3) < 3.7) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })

  it ('num_float from string', function () {
    var template =
      '<component>' +
      '<if test={(num_float(\'123.456\') > 123.45 && num_float(\'123.456\') < 123.46) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })

  it ('num_pow', function () {
    var template =
      '<component>' +
      '<if test={(num_pow(2, 3) == 8 && num_pow(8, 4) == 4096) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })

  it ('num_abs', function () {
    var template =
      '<component>' +
      '<if test={(num_abs(-2) == 2 && num_abs(0) == 0 && num_abs(2) == 2) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })

  it ('num_acos', function () {
    var template =
      '<component>' +
      '<if test={(num_acos(0.5) > 1.04 && num_acos(0.5) < 1.05) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })

  it ('num_asin', function () {
    var template =
      '<component>' +
      '<if test={(num_asin(0.5) > 0.52 && num_asin(0.5) < 0.53) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })

  it ('num_atan', function () {
    var template =
      '<component>' +
      '<if test={(num_atan(0.5) > 0.46 && num_atan(0.5) < 0.47) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })

  it ('num_cos', function () {
    var template =
      '<component>' +
      '<if test={(num_cos(0.5) > 0.87 && num_cos(0.5) < 0.88) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })

  it ('num_sin', function () {
    var template =
      '<component>' +
      '<if test={(num_sin(0.5) > 0.47 && num_sin(0.5) < 0.48) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })

  it ('num_tan', function () {
    var template =
      '<component>' +
      '<if test={(num_tan(0.5) > 0.54 && num_tan(0.5) < 0.55) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })

  it ('num_round to up', function () {
    return parseJs('<component>{ num_round(11/3) }</component>').should.eventually.deep.equal([4])
  })

  it ('num_round to down', function () {
    return parseJs('<component>{ num_round(15/7) }</component>').should.eventually.deep.equal([2])
  })

  it ('num_round half to up', function () {
    return parseJs('<component>{ num_round(15/2) }</component>').should.eventually.deep.equal([8])
  })

  it ('num_round negative to up', function () {
    return parseJs('<component>{ num_round(-11/3) }</component>').should.eventually.deep.equal([-4])
  })

  it ('num_round negative to down', function () {
    return parseJs('<component>{ num_round(-15/7) }').should.eventually.deep.equal([-2])
  })

  it ('num_round negative half to up', function () {
    return parseJs('<component>{ num_round(-15/2) }</component>').should.eventually.deep.equal([-7])
  })

  it ('num_sqrt', function () {
    return parseJs('<component>{ num_sqrt(16) }</component>').should.eventually.deep.equal([4])
  })

  it ('num_rand', function () {
    var template =
      '<component>' +
      '<variable name={rand} value={num_rand() } />' +
      '<if test={(rand >= 0 && rand <= 1) }>' +
      'good' +
      '</if>' +
      '</component>'

    return parseJs(template).should.eventually.deep.equal(['good'])
  })
})
