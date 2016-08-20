/* globals before, describe, it, Promise */

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var clearDir = require('clear-dir')
var path = require('path')

var tmpFilesDirPath = path.resolve(__dirname, '../tmp')

var parsePhp = require('./helpers/parse-php').parsePhp
var parsePhpAndWriteFile = require('./helpers/parse-php').parsePhpAndWriteFile
var runPhpTemplate = require('./helpers/parse-php').runPhpTemplate

var parseJs = require('./helpers/parse-js').parseJs
var parseJsAndWriteFile = require('./helpers/parse-js').parseJsAndWriteFile
var runJsTemplate = require('./helpers/parse-js').runJsTemplate

chai.use(chaiAsPromised)
chai.should()

before(function (done) {
  clearDir(tmpFilesDirPath, done)
})

describe('PHP stringifier', function () {
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

    return parsePhp('{ for (item, news) }<h1>{ item[\'title\'] }</h1>{ endfor }', params)
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
    var template = '{ for (index, item, news) }<h1 data-index="{index}">{ item[\'title\'] }</h1>{ endfor }'

    return parsePhp(template, params)
      .should.eventually.equal('<h1 data-index="0">News</h1><h1 data-index="1">Olds</h1>')
  })

  it ('if expression', function () {
    var template = '{ if (a == b) }{ a = a + b }{elseif (a > b && b < a) }{ a = a - b}{else}{ a = b }{ endif }{a}'
    var params = {a: 5, b: 10}

    return parsePhp(template, params).should.eventually.equal('10')
  })

  it ('if expression', function () {
    var template = '{ if (a == b) }{ a = a + b }{elseif (a > b && b < a) }{ a = a - b}{else}{ a = b }{ endif }{a}'
    var params = {a: 10, b: 5}

    return parsePhp(template, params).should.eventually.equal('5')
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
    var template = '{ if (!field[\'hide\']? || (field[\'hide\']? && !field[\'hide\'])) }hidden{else}show{endif }'

    return parsePhp(template, {field: {}}).should.eventually.equal('hidden')
  })

  it ('import and inlude', function () {
    var tempAsideName = 'tmp' + parseInt(Math.random() * 1000)

    return Promise.all([
      parsePhpAndWriteFile('<aside>{childs}</aside>', tempAsideName + '.php')
    ])
      .then(function () {
        return parsePhp('{ import (Aside, "./' + tempAsideName + '")}<div><Aside><h1>Hello</h1></Aside></div>')
      })
      .should.eventually.equal('<div><aside><h1>Hello</h1></aside></div>')
  })

  it ('include with recursive parameters', function () {
    var tempCommentsName = 'tmp' + parseInt(Math.random() * 1000)
    var template =
      '{ import(Comments, \'./' + tempCommentsName + '\') }{ for (comment, comments) }<div>{ comment[\'name\'] }<div>' +
      '<Comments comments={ comment[\'childs\'] } /></div>' +
      '</div>{ endfor }'
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
    var tempWrapName = 'tmp' + parseInt(Math.random() * 1000)
    var tempAsideName = 'tmp' + parseInt(Math.random() * 1000)
    var tempName = 'tmp' + parseInt(Math.random() * 1000)
    var wrapTemplate = '<wrap title="{ title }">{childs}</wrap>'
    var asideTemplate = '<aside>{ childs }<hr /></aside>'
    var template =
      '{import(Wrap, \'./' + tempWrapName + '\')}{import(Aside, \'./' + tempAsideName + '\')}' +
      '{variable = 1}' +
      '<Wrap title="Title of Wrap!"><Aside>Text{variable = variable + 1}</Aside></Wrap>{variable}'

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

describe('Javascript stringifier', function () {
  it ('empty string', function () {
    return parseJs('').should.eventually.deep.equal([])
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

    return parseJs('{ b + c[d][\'str\'] * 2 }', params).should.eventually.deep.equal([{text: 7, type: 'text'}])

  })

  it ('doctype', function () {
    var template =
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >' +
      '<html lang="en"><head><meta charset="UTF-8" /><title>Document</title></head><body></body></html>'
    var result = [
      {
        type: 'node',
        name: '!DOCTYPE',
        childs: [],
        attrs: [
          {
            name: 'html',
            value: ''
          },
          {
            name: 'PUBLIC',
            value: ''
          },
          {
            name: 'undefined',
            value: '-//W3C//DTD XHTML 1.0 Transitional//EN'
          },
          {
            name: 'undefined',
            value: 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'
          }
        ]
      },
      {
        type: 'node',
        name: 'html',
        attrs: [
          {
            name: 'lang',
            value: 'en'
          }
        ],
        childs: [
          {
            type: 'node',
            name: 'head',
            attrs: [],
            childs: [
              {
                type: 'node',
                name: 'meta',
                attrs: [
                  {
                    name: 'charset',
                    value: 'UTF-8'
                  }
                ],
                childs: []
              },
              {
                type: 'node',
                name: 'title',
                attrs: [],
                childs: [
                  {
                    type: 'text',
                    value: 'Document'
                  }
                ]
              }
            ]
          },
          {
            type: 'node',
            name: 'body',
            attrs: [],
            childs: []
          }
        ]
      }
    ]

    parseJs(template).should.eventually.deep.equal(result)
  })

  it ('include with recursive parameters', function () {
    var tempCommentsName = 'tmp' + parseInt(Math.random() * 1000)
    var template =
      '{ import(Comments, \'./' + tempCommentsName + '\') }{ for (comment, comments) }<div>{ comment[\'name\'] }<div>' +
      '<Comments comments={ comment[\'childs\'] } /></div>' +
      '</div>{ endfor }'
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
    var result = [
      {
        type: 'node',
        name: 'div',
        attrs: [],
        childs: [
          {
            type: 'text',
            text: 'Aleksei'
          },
          {
            type: 'node',
            name: 'div',
            attrs: [],
            childs: [
              {
                type: 'node',
                name: 'div',
                attrs: [],
                childs: [
                  {
                    type: 'text',
                    text: 'Natasha'
                  },
                  {
                    type: 'node',
                    name: 'div',
                    attrs: [],
                    childs: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]

    return parseJsAndWriteFile(template, tempCommentsName + '.js')
      .then(function () {
        return runJsTemplate(tempCommentsName, data)
      })
      .should.eventually.deep.equal(result)
  })

  it ('include with common scope of template and childs', function () {
    var tempWrapName = 'tmp' + parseInt(Math.random() * 1000)
    var tempAsideName = 'tmp' + parseInt(Math.random() * 1000)
    var tempName = 'tmp' + parseInt(Math.random() * 1000)
    var wrapTemplate = '<wrap title="{ title }">{childs}</wrap>'
    var asideTemplate = '<aside>{ childs }<hr /></aside>'
    var template =
      '{import(Wrap, \'./' + tempWrapName + '\')}{import(Aside, \'./' + tempAsideName + '\')}' +
      '{variable = 1}' +
      '<Wrap title="Title of Wrap!"><Aside>Text{variable = variable + 1}</Aside></Wrap>{variable}'
    var result = [
      {
        type: 'node',
        name: 'wrap',
        attrs: [
          {
            name: 'title',
            value: 'Title of Wrap!'
          }
        ],
        childs: [
          {
            type: 'node',
            name: 'aside',
            attrs: [],
            childs: [
              {
                type: 'text',
                text: 'Text'
              },
              {
                type: 'node',
                name: 'hr',
                attrs: [],
                childs: []
              }
            ]
          }
        ]
      },
      {
        type: 'text',
        text: 2
      }
    ]

    return Promise.all([
      parseJsAndWriteFile(wrapTemplate, tempWrapName + '.js'),
      parseJsAndWriteFile(asideTemplate, tempAsideName + '.js'),
      parseJsAndWriteFile(template, tempName + '.js')
    ])
      .then(function () {
        return runJsTemplate(tempName)
      })
      .should.eventually.deep.equal(result)
  })
})
