/* globals describe, it, Promise */

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

var generateName = require('./helpers/generate-name')
var parsePhp = require('./helpers/parse-php').parsePhp
var parsePhpAndWriteFile = require('./helpers/parse-php').parsePhpAndWriteFile
var runPhpTemplate = require('./helpers/parse-php').runPhpTemplate

chai.use(chaiAsPromised)
chai.should()

describe ('PHP stringifier', function () {
  this.timeout(3000)

  it ('empty string', function () {
    return parsePhp('').should.eventually.equal('')
  })

  it ('html empty comment', function () {
    return parsePhp('<!---->').should.eventually.equal('<!---->')
  })

  it ('html text comment', function () {
    return parsePhp('<!-- some text 12345 _ # $ % ! - -- = [ ] \{ \} + ; : ( ) " \' \ / ~ _#$%!--=+;:()"\'\/~ qwe123:-_ -->')
      .should.eventually.equal('<!-- some text 12345 _ # $ % ! - -- = [ ] \{ \} + ; : ( ) " \' \ / ~ _#$%!--=+;:()"\'\/~ qwe123:-_ -->')
  })

  it ('echo expression', function () {
    var params = {
      b: 1,
      c: {
        variable: {
          str: 3
        }
      },
      d: 'variable'
    }

    return parsePhp('{ b + c[d][\'str\'] * 2 }', params).should.eventually.equal('7')
  })

  it ('foreach expression without index', function () {
    var template =
      '{ for (item, news) }' +
      '<h1>{ item[\'title\'] }</h1>' +
      '{ endfor }'
    var params = {
      news: [
        {
          title: 'News'
        },
        {
          title: 'Olds'
        }
      ]
    }

    return parsePhp(template, params)
      .should.eventually.equal('<h1>News</h1><h1>Olds</h1>')
  })

  it ('foreach expression with index', function () {
    var params = {
      news: [
        {
          title: 'News'
        },
        {
          title: 'Olds'
        }
      ]
    }
    var template =
      '{ for (index, item, news) }' +
      '<h1 data-index="{index}">{ item[\'title\'] }</h1>' +
      '{ endfor }'

    return parsePhp(template, params)
      .should.eventually.equal('<h1 data-index="0">News</h1><h1 data-index="1">Olds</h1>')
  })

  it ('if expression', function () {
    var template =
      '{ if (a == b) }' +
      '{ a = a + b }' +
      '{elseif (a > b && b < a) }' +
      '{ a = a - b}' +
      '{else}' +
      '{ a = b }' +
      '{ endif }' +
      '{a}'
    var params = {a: 5, b: 10}

    return parsePhp(template, params).should.eventually.equal('10')
  })

  it ('foreach and if statements at attributes at single tag', function () {
    var template = '<input title="Hello"{for (item, [0..3])} {if (item > 1) }tabindex{endif}{endfor} />'

    return parsePhp(template).should.eventually.equal('<input title="Hello" tabindex tabindex />')
  })

  it ('foreach and if statements at attributes at couple tag', function () {
    var template = '<div title="Hello"{for (item, [0..3])} {if (item > 1) }tabindex="item{item}"{endif}{endfor}></div>'

    return parsePhp(template).should.eventually.equal('<div title="Hello" tabindex="item2" tabindex="item3"></div>')
  })

  it ('if expression', function () {
    var template = '{ if (a == b) }{ a = a + b }{elseif (a > b && b < a) }{ a = a - b}{else}{ a = b }{ endif }{a}'
    var params = {a: 10, b: 5}

    return parsePhp(template, params).should.eventually.equal('5')
  })

  it ('array expressions open range grow up', function () {
    return parsePhp('{ for(item, [5...end]) }{ item }{ endfor }', {end: 9}).should.eventually.equal('5678')
  })

  it ('array expressions open range grow down', function () {
    return parsePhp('{ for(item, [5...end]) }{ item }{ endfor }', {end: 0}).should.eventually.equal('54321')
  })

  it ('array expressions closed range grow up', function () {
    return parsePhp('{ for(item, [5..end]) }{ item }{ endfor }', {end: 9}).should.eventually.equal('56789')
  })

  it ('array expressions closed range grow down', function () {
    return parsePhp('{ for(item, [5..end]) }{ item }{ endfor }', {end: 0}).should.eventually.equal('543210')
  })

  it ('doctype', function () {
    return parsePhp(
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >' +
      '<html lang="en"><head><meta charset="UTF-8" /><title>Document</title></head><body></body></html>'
    )
      .should.eventually.equal(
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
        '<html lang="en"><head><meta charset="UTF-8" /><title>Document</title></head><body></body></html>'
      )
  })

  it ('isset', function () {
    var template =
      '{ if (!field[\'hide\']? || (field[\'hide\']? && !field[\'hide\'])) }' +
      'hidden' +
      '{else}' +
      'show' +
      '{endif }'

    return parsePhp(template, {field: {}}).should.eventually.equal('hidden')
  })

  it ('import and inlude', function () {
    var tempAsideName = generateName()

    return parsePhpAndWriteFile('<aside>{childs}</aside>', tempAsideName + '.php')
      .then(function () {
        var template =
          '{ import (Aside, "./' + tempAsideName + '")}' +
          '<div><Aside><h1>Hello</h1></Aside></div>'

        return parsePhp(template)
      })
      .should.eventually.equal('<div><aside><h1>Hello</h1></aside></div>')
  })

  it ('include with recursive parameters', function () {
    var tempCommentsName = generateName()
    var template =
      '{ import(Comments, \'./' + tempCommentsName + '\') }' +
      '{ for (comment, comments) }' +
      '<div>{ comment[\'name\'] }<div>' +
      '<Comments comments={ comment[\'childs\'] } /></div>' +
      '</div>' +
      '{ endfor }'
    var data = {
      comments: [
        {
          name: 'Aleksei',
          childs: [
            {
              name: 'Natasha',
              childs: []
            }
          ]
        }
      ]
    }

    return parsePhpAndWriteFile(template, tempCommentsName + '.php')
      .then(function () {
        return runPhpTemplate(tempCommentsName, data)
      })
      .should.eventually.equal('<div>Aleksei<div><div>Natasha<div></div></div></div></div>')
  })

  it ('include with common scope of template and childs', function () {
    var tempWrapName = 'tmp' + generateName()
    var tempAsideName = 'tmp' + generateName()
    var tempName = 'tmp' + generateName()
    var wrapTemplate = '<wrap title="{ title }">{childs}</wrap>'
    var asideTemplate = '<aside>{ childs }<hr /></aside>'
    var template =
      '{import(Wrap, \'./' + tempWrapName + '\')}' +
      '{import(Aside, \'./' + tempAsideName + '\')}' +
      '{variable = 1}' +
      '<Wrap title="Title of Wrap!">' +
      '<Aside>Text{variable = variable + 1}</Aside>' +
      '</Wrap>' +
      '{variable}'

    return Promise.all([
      parsePhpAndWriteFile(wrapTemplate, tempWrapName + '.php'),
      parsePhpAndWriteFile(asideTemplate, tempAsideName + '.php'),
      parsePhpAndWriteFile(template, tempName + '.php')
    ])
      .then(function () {
        return runPhpTemplate(tempName)
      })
      .should.eventually.equal('<wrap title="Title of Wrap!"><aside>Text<hr /></aside></wrap>2')
  })
})
