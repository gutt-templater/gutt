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

describe ('PHP string functions', function () {
  it ('str with no params', function () {
    return parsePhp('{ str(11/3) }').should.eventually.equal('3')
  })

  it ('str with one param', function () {
    return parsePhp('{ str(11/3, 2) }').should.eventually.equal('3.66')
  })

  it ('str with nulls after coma', function () {
    return parsePhp('{ str(12/3, 2) }').should.eventually.equal('4.00')
  })

  it ('str with two params', function () {
    return parsePhp('{ str(11/3, 3, \',\') }').should.eventually.equal('3,666')
  })

  it ('str_sub with one param', function () {
    return parsePhp('{ str_sub(\'string\', 2) }').should.eventually.equal('ring')
  })

  it ('str_sub with two param', function () {
    return parsePhp('{ str_sub(\'string\', 2, 2) }').should.eventually.equal('ri')
  })

  it ('str_sub with negative second param', function () {
    return parsePhp('{ str_sub(\'string\', 0, -1) }').should.eventually.equal('strin')
  })

  it ('str_len for not empty string', function () {
    return parsePhp('{ str_len(\'string\') }').should.eventually.equal('6')
  })

  it ('str_len for empty string', function () {
    return parsePhp('{ str_len(\'\') }').should.eventually.equal('0')
  })

  it ('str_replace symbol to another symbol', function () {
    return parsePhp('{ str_replace(\'replace all symbols\', \'l\', \'1\') }')
      .should.eventually.equal('rep1ace a11 symbo1s')
  })

  it ('str_replace symbol to empty string', function () {
    return parsePhp('{ str_replace(\'replace all symbols\', \'l\', \'\') }')
      .should.eventually.equal('repace a symbos')
  })

  it ('str_pad for right side', function () {
    return parsePhp('{ str_pad(\'string\', 10, \'~\') }').should.eventually.equal('string~~~~')
  })

  it ('str_pad for right side with param', function () {
    return parsePhp('{ str_pad(\'string\', 10, \'~\', STRPADRIGHT) }')
      .should.eventually.equal('string~~~~')
  })

  it ('str_pad for left side', function () {
    return parsePhp('{ str_pad(\'string\', 10, \'~\', STRPADLEFT) }')
      .should.eventually.equal('~~~~string')
  })

  it ('str_pad for both sides', function () {
    return parsePhp('{ str_pad(\'string\', 10, \'~\', STRPADBOTH) }')
      .should.eventually.equal('~~string~~')
  })

  it ('str_pad with string longer than length param', function () {
    return parsePhp('{ str_pad(\'accessabillity\', 10, \'~\', STRPADBOTH) }')
      .should.eventually.equal('accessabillity')
  })

  it ('str_split returns array with origin string', function () {
    var template =
      '{ arr = str_split(\'string\', \'wrong splitter\') }' +
      '{ for (letter, arr) }{ letter },{ endfor }'

    return parsePhp(template).should.eventually.equal('string,')
  })

  it ('str_split with empty splitter, returns array of letter', function () {
    var template =
      '{ arr = str_split(\'string\', \'\') }' +
      '{ for (letter, arr) }{ letter },{ endfor }'

    return parsePhp(template).should.eventually.equal('s,t,r,i,n,g,')
  })

  it ('str_split with not empty splitter, returns array of substrings', function () {
    var template =
      '{ arr = str_split(\'London is The Capital of Greate Britan\', \' \') }' +
      '{ for (letter, arr) }{ letter }-{ endfor }'

    return parsePhp(template).should.eventually.equal('London-is-The-Capital-of-Greate-Britan-')
  })

  it ('str_pos returns negative', function () {
    return parsePhp('{ str_pos(\'accessabillity\', \'~\') }')
      .should.eventually.equal('-1')
  })

  it ('str_pos returns zero', function () {
    return parsePhp('{ str_pos(\'accessabillity\', \'a\') }')
      .should.eventually.equal('0')
  })

  it ('str_pos returns positive', function () {
    return parsePhp('{ str_pos(\'accessabillity\', \'llity\') }')
      .should.eventually.equal('9')
  })

  it ('str_lower', function () {
    return parsePhp('{ str_lower(\'aCCeSSaBiLLiTy\') }').should.eventually.equal('accessabillity')
  })

  it ('str_upper', function () {
    return parsePhp('{ str_upper(\'aCCeSSaBiLLiTy\') }').should.eventually.equal('ACCESSABILLITY')
  })

  it ('str_upfirst', function () {
    return parsePhp('{ str_upfirst(\'first  second # third\') }')
      .should.eventually.equal('First Second # Third')
  })

  it ('str_camel', function () {
    return parsePhp('{ str_camel(\'first  second # third\') }')
      .should.eventually.equal('firstSecond#Third')
  })

  it ('str_kebab', function () {
    return parsePhp('{ str_kebab(\'first  second # third\') }')
      .should.eventually.equal('first-second-#-third')
  })

  it ('str_trim', function () {
    return parsePhp('{ str_trim(\'  \n  \t  first  second # third  \n  \t  \') }')
      .should.eventually.equal('first  second # third')
  })

  it ('str_ltrim', function () {
    return parsePhp('{ str_ltrim(\'  \n  \t  first  second # third  \n  \t  \') }')
      .should.eventually.equal('first  second # third  \n  \t  ')
  })

  it ('str_rtrim', function () {
    return parsePhp('{ str_rtrim(\'  \n  \t  first  second # third  \n  \t  \') }')
      .should.eventually.equal('  \n  \t  first  second # third')
  })

  it ('str_htmlescape', function () {
    return parsePhp('{ str_htmlescape(\'<html lang="en">text</html>\') }')
      .should.eventually.equal('&lt;html lang=&quot;en&quot;&gt;text&lt;/html&gt;')
  })

  it ('str_urlencode', function () {
    return parsePhp('{ str_urlencode(\'http://localhost:8080/index.html?param=value&param=value\') }')
      .should.eventually.equal('http%3A%2F%2Flocalhost%3A8080%2Findex.html%3Fparam%3Dvalue%26param%3Dvalue')
  })

  it ('str_urldecode', function () {
    return parsePhp('{ str_urldecode(\'http%3A%2F%2Flocalhost%3A8080%2Findex.html%3Fparam%3Dvalue%26param%3Dvalue\') }')
      .should.eventually.equal('http://localhost:8080/index.html?param=value&param=value')
  })
})
