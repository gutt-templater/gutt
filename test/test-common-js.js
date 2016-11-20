/* globals describe, it, Promise */

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

var generateName = require('./helpers/generate-name')
var parseJs = require('./helpers/parse-js').parseJs
var parseJsAndWriteFile = require('./helpers/parse-js').parseJsAndWriteFile
var runJsTemplate = require('./helpers/parse-js').runJsTemplate

chai.use(chaiAsPromised)
chai.should()

describe ('Javascript stringifier', function () {
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

    return parseJs('{ b + c[d][\'str\'] * 2 }', params).should.eventually.deep.equal([{text: '7', type: 'text'}])
  })

  it ('echo expression 2', function () {
    var params = {
      b: 1,
      c: {
        variable: {
          str: 3
        }
      },
      d: 'variable'
    }

    return parseJs('{ b + c[d].str * 2 }', params).should.eventually.deep.equal([{text: '7', type: 'text'}])
  })

  it ('foreach and if statements at attributes at couple tag', function () {
    var template = '<div title="Hello"{for (item, [0..3])} {if (item > 1) }tabindex="item{item}"{endif}{endfor}></div>'
    var result = [
      {
        type: 'node',
        name: 'div',
        attrs: {
          'title': 'Hello',
          'tabindex': 'item3'
        },
        childs: []
      }
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('foreach and if statements at attributes at single tag', function () {
    var template = '<input title="Hello"{for (item, [0..3])} {if (item > 1) }tabindex{endif}{endfor} />'
    var result = [
      {
        type: 'node',
        name: 'input',
        attrs: {
          'title': 'Hello',
          'tabindex': ''
        },
        childs: []
      }
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('array expressions open range grow up', function () {
    var result = [
      {
        text: '5',
        type: 'text'
      },
      {
        text: '6',
        type: 'text'
      },
      {
        text: '7',
        type: 'text'
      },
      {
        text: '8',
        type: 'text'
      }
    ]

    return parseJs('{ for(item, [5...end]) }{ item }{ endfor }', {end: 9}).should.eventually.deep.equal(result)
  })

  it ('array expressions open range grow down', function () {
    var result = [
      {
        text: '9',
        type: 'text'
      },
      {
        text: '8',
        type: 'text'
      },
      {
        text: '7',
        type: 'text'
      },
      {
        text: '6',
        type: 'text'
      }
    ]

    return parseJs('{ for(item, [start...5]) }{ item }{ endfor }', {start: 9}).should.eventually.deep.equal(result)
  })

  it ('array expressions closed range grow up', function () {
    var result = [
      {
        text: '5',
        type: 'text'
      },
      {
        text: '6',
        type: 'text'
      },
      {
        text: '7',
        type: 'text'
      },
      {
        text: '8',
        type: 'text'
      },
      {
        text: '9',
        type: 'text'
      }
    ]

    return parseJs('{ for(item, [5..end]) }{ item }{ endfor }', {end: 9}).should.eventually.deep.equal(result)
  })

  it ('array expressions closed range grow down', function () {
    var result = [
      {
        text: '9',
        type: 'text'
      },
      {
        text: '8',
        type: 'text'
      },
      {
        text: '7',
        type: 'text'
      },
      {
        text: '6',
        type: 'text'
      },
      {
        text: '5',
        type: 'text'
      }
    ]

    return parseJs('{ for(item, [start..5]) }{ item }{ endfor }', {start: 9}).should.eventually.deep.equal(result)
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
        attrs: {
          'html': '',
          'PUBLIC': '',
          'undefined': 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'
        }
      },
      {
        type: 'node',
        name: 'html',
        attrs: {
          'lang': 'en'
        },
        childs: [
          {
            type: 'node',
            name: 'head',
            attrs: {},
            childs: [
              {
                type: 'node',
                name: 'meta',
                attrs: {
                  'charset': 'UTF-8'
                },
                childs: []
              },
              {
                type: 'node',
                name: 'title',
                attrs: {},
                childs: [
                  {
                    type: 'text',
                    text: 'Document'
                  }
                ]
              }
            ]
          },
          {
            type: 'node',
            name: 'body',
            attrs: {},
            childs: []
          }
        ]
      }
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('include with recursive parameters', function () {
    var tempCommentsName = generateName()
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
        attrs: {},
        childs: [
          {
            type: 'text',
            text: 'Aleksei'
          },
          {
            type: 'node',
            name: 'div',
            attrs: {},
            childs: [
              {
                type: 'node',
                name: 'div',
                attrs: {},
                childs: [
                  {
                    type: 'text',
                    text: 'Natasha'
                  },
                  {
                    type: 'node',
                    name: 'div',
                    attrs: {},
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
    var tempWrapName = generateName()
    var tempAsideName = generateName()
    var tempName = generateName()
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
        attrs: {
          'title': 'Title of Wrap!'
        },
        childs: [
          {
            type: 'node',
            name: 'aside',
            attrs: {},
            childs: [
              {
                type: 'text',
                text: 'Text'
              },
              {
                type: 'node',
                name: 'hr',
                attrs: {},
                childs: []
              }
            ]
          }
        ]
      },
      {
        type: 'text',
        text: '2'
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
