/* globals before, describe, it */

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var clearDir = require('clear-dir')
var path = require('path')

var tmpFilesDirPath = path.resolve(__dirname, '../tmp')

var parseJs = require('./helpers/parse-js').parseJs

chai.use(chaiAsPromised)
chai.should()

before(function (done) {
  clearDir(tmpFilesDirPath, done)
})

describe ('JS string functions', function () {
  it ('str with no params', function () {
    return parseJs('{ str(11/3) }').should.eventually.deep.equal([{type: 'text', text: '3'}])
  })

  it ('str with one param', function () {
    return parseJs('{ str(11/3, 2) }').should.eventually.deep.equal([{type: 'text', text: '3.66'}])
  })

  it ('str with nulls after coma', function () {
    return parseJs('{ str(12/3, 2) }').should.eventually.deep.equal([{type: 'text', text: '4.00'}])
  })

  it ('str with two params', function () {
    return parseJs('{ str(11/3, 3, \',\') }')
      .should.eventually.deep.equal([{type: 'text', text: '3,666'}])
  })

  it ('str_sub with one param', function () {
    return parseJs('{ str_sub(\'string\', 2) }')
      .should.eventually.deep.equal([{type: 'text', text: 'ring'}])
  })

  it ('str_sub with two param', function () {
    return parseJs('{ str_sub(\'string\', 2, 2) }')
      .should.eventually.deep.equal([{type: 'text', text: 'ri'}])
  })

  it ('str_sub with negative second param', function () {
    return parseJs('{ str_sub(\'string\', 2, -2) }')
      .should.eventually.deep.equal([{type: 'text', text: 'ri'}])
  })

  it ('str_len for not empty string', function () {
    return parseJs('{ str_len(\'string\') }')
      .should.eventually.deep.equal([{type: 'text', text: 6}])
  })

  it ('str_len for empty string', function () {
    return parseJs('{ str_len(\'\') }')
      .should.eventually.deep.equal([{type: 'text', text: 0}])
  })

  it ('str_replace symbol to another symbol', function () {
    return parseJs('{ str_replace(\'replace all symbols\', \'l\', \'1\') }')
      .should.eventually.deep.equal([{type: 'text', text: 'rep1ace a11 symbo1s'}])
  })

  it ('str_replace symbol to empty string', function () {
    return parseJs('{ str_replace(\'replace all symbols\', \'l\', \'\') }')
      .should.eventually.deep.equal([{type: 'text', text: 'repace a symbos'}])
  })

  it ('str_pad for right side', function () {
    return parseJs('{ str_pad(\'string\', 10, \'~\') }')
      .should.eventually.deep.equal([{type: 'text', text: 'string~~~~'}])
  })

  it ('str_pad for right side with param', function () {
    return parseJs('{ str_pad(\'string\', 10, \'~\', STRPADRIGHT) }')
      .should.eventually.deep.equal([{type: 'text', text: 'string~~~~'}])
  })

  it ('str_pad for left side', function () {
    return parseJs('{ str_pad(\'string\', 10, \'~\', STRPADLEFT) }')
      .should.eventually.deep.equal([{type: 'text', text: '~~~~string'}])
  })

  it ('str_pad for both sides', function () {
    return parseJs('{ str_pad(\'string\', 10, \'~\', STRPADBOTH) }')
      .should.eventually.deep.equal([{type: 'text', text: '~~string~~'}])
  })

  it ('str_pad with string longer than length param', function () {
    return parseJs('{ str_pad(\'accessabillity\', 10, \'~\', STRPADBOTH) }')
      .should.eventually.deep.equal([{type: 'text', text: 'accessabillity'}])
  })

  it ('str_split returns array with origin string', function () {
    var template =
      '{ arr = str_split(\'string\', \'wrong splitter\') }' +
      '{ for (letter, arr) }{ letter },{ endfor }'
    var result = [
      {type: 'text', text: 'string'},
      {type: 'text', text: ','}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('str_split with empty splitter, returns array of letter', function () {
    var template =
      '{ arr = str_split(\'string\', \'\') }' +
      '{ for (letter, arr) }{ letter },{ endfor }'
    var result = [
      {type: 'text', text: 's'},
      {type: 'text', text: ','},
      {type: 'text', text: 't'},
      {type: 'text', text: ','},
      {type: 'text', text: 'r'},
      {type: 'text', text: ','},
      {type: 'text', text: 'i'},
      {type: 'text', text: ','},
      {type: 'text', text: 'n'},
      {type: 'text', text: ','},
      {type: 'text', text: 'g'},
      {type: 'text', text: ','}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('str_split with not empty splitter, returns array of substrings', function () {
    var template =
      '{ arr = str_split(\'London is The Capital of Greate Britan\', \' \') }' +
      '{ for (letter, arr) }{ letter }-{ endfor }'
    var result = [
      {type: 'text', text: 'London'},
      {type: 'text', text: '-'},
      {type: 'text', text: 'is'},
      {type: 'text', text: '-'},
      {type: 'text', text: 'The'},
      {type: 'text', text: '-'},
      {type: 'text', text: 'Capital'},
      {type: 'text', text: '-'},
      {type: 'text', text: 'of'},
      {type: 'text', text: '-'},
      {type: 'text', text: 'Greate'},
      {type: 'text', text: '-'},
      {type: 'text', text: 'Britan'},
      {type: 'text', text: '-'}
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('str_pos returns negative', function () {
    return parseJs('{ str_pos(\'accessabillity\', \'~\') }')
      .should.eventually.deep.equal([{type: 'text', text: -1}])
  })

  it ('str_pos returns zero', function () {
    return parseJs('{ str_pos(\'accessabillity\', \'a\') }')
      .should.eventually.deep.equal([{type: 'text', text: 0}])
  })

  it ('str_pos returns positive', function () {
    return parseJs('{ str_pos(\'accessabillity\', \'llity\') }')
      .should.eventually.deep.equal([{type: 'text', text: 9}])
  })

  it ('str_lower', function () {
    return parseJs('{ str_lower(\'aCCeSSaBiLLiTy\') }')
      .should.eventually.deep.equal([{type: 'text', text: 'accessabillity'}])
  })

  it ('str_upper', function () {
    return parseJs('{ str_upper(\'aCCeSSaBiLLiTy\') }')
      .should.eventually.deep.equal([{type: 'text', text: 'ACCESSABILLITY'}])
  })

  it ('str_upfirst', function () {
    return parseJs('{ str_upfirst(\'first  second # third\') }')
      .should.eventually.deep.equal([{type: 'text', text: 'First Second # Third'}])
  })

  it ('str_camel', function () {
    return parseJs('{ str_camel(\'first  second # third\') }')
      .should.eventually.deep.equal([{type: 'text', text: 'firstSecond#Third'}])
  })

  it ('str_kebab', function () {
    return parseJs('{ str_kebab(\'first  second # third\') }')
      .should.eventually.deep.equal([{type: 'text', text: 'first-second-#-third'}])
  })

  it ('str_trim', function () {
    return parseJs('{ str_trim(\'  \n  \t  first  second # third  \n  \t  \') }')
      .should.eventually.deep.equal([{type: 'text', text: 'first  second # third'}])
  })

  it ('str_ltrim', function () {
    return parseJs('{ str_ltrim(\'  \n  \t  first  second # third  \n  \t  \') }')
      .should.eventually.deep.equal([{type: 'text', text: 'first  second # third  \n  \t  '}])
  })

  it ('str_rtrim', function () {
    return parseJs('{ str_rtrim(\'  \n  \t  first  second # third  \n  \t  \') }')
      .should.eventually.deep.equal([{type: 'text', text: '  \n  \t  first  second # third'}])
  })

  it ('str_htmlescape', function () {
    return parseJs('{ str_htmlescape(\'<html lang="en">text</html>\') }')
      .should.eventually.deep.equal([{type: 'text', text: '&lt;html lang=&quot;en&quot;&gt;text&lt;/html&gt;'}])
  })

  it ('str_urlencode', function () {
    return parseJs('{ str_urlencode(\'http://localhost:8080/index.html?param=value&param=value\') }')
      .should.eventually.deep.equal([{type: 'text', text: 'http%3A%2F%2Flocalhost%3A8080%2Findex.html%3Fparam%3Dvalue%26param%3Dvalue'}])
  })

  it ('str_urldecode', function () {
    return parseJs('{ str_urldecode(\'http%3A%2F%2Flocalhost%3A8080%2Findex.html%3Fparam%3Dvalue%26param%3Dvalue\') }')
      .should.eventually.deep.equal([{type: 'text', text: 'http://localhost:8080/index.html?param=value&param=value'}])
  })
})
