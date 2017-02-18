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

    return parseJs('<component>{ b + c[d][\'str\'] * 2 }</component>', params).should.eventually.deep.equal([7])
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

    return parseJs('<component>{ b + c[d].str * 2 }</component>', params).should.eventually.deep.equal([7])
  })

  it ('foreach expression without index', function () {
    var template =
      '<component>' +
      '<for-each item={item} from={news}>' +
      '<h1>{ item.title }</h1>' +
      '</for-each>' +
      '</component>'
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
    var result = [
      {
        tag: 'h1',
        attrs: {},
        children: [
          'News'
        ]
      },
      {
        tag: 'h1',
        attrs: {},
        children: [
          'Olds'
        ]
      }
    ]

    return parseJs(template, params).should.eventually.deep.equal(result)
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
      '<component>' +
      '<for-each key={index} item={item} from={news}>' +
      '<h1 data-index={index}>{item[\'title\']}</h1>' +
      '</for-each>' +
      '</component>'
    var result = [
      {
        tag: 'h1',
        attrs: {
          'data-index': '0'
        },
        children: [
          'News'
        ]
      },
      {
        tag: 'h1',
        attrs: {
          'data-index': '1'
        },
        children: [
          'Olds'
        ]
      }
    ]

    return parseJs(template, params).should.eventually.deep.equal(result)
  })

  it ('foreach statement at attributes at single tag', function () {
    var template =
      '<component>' +
      '<input title="Hello">' +
      '<for-each item={item} from={[0..3]}>' +
      '<attribute name={"data-index" ++ item} value={item} />' +
      '</for-each>' +
      '</input>' +
      '</component>'
    var result = [
      {
        tag: 'input',
        attrs: {
          title: 'Hello',
          'data-index0': 0,
          'data-index1': 1,
          'data-index2': 2,
          'data-index3': 3
        },
        children: []
      }
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('foreach statement at attributes at couple tag', function () {
    var template =
      '<component>' +
      '<div title="Hello">' +
      '<for-each item={item} from={[0..3]}>' +
      '<attribute name={"data-index" ++ item} value={item} />' +
      '</for-each>' +
      '</div>' +
      '</component>'
    var result = [
      {
        tag: 'div',
        attrs: {
          title: 'Hello',
          'data-index0': 0,
          'data-index1': 1,
          'data-index2': 2,
          'data-index3': 3
        },
        children: []
      }
    ]

    return parseJs(template, {item: 2}).should.eventually.deep.equal(result)
  })

  it ('switch statement for tags with default', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<default>' +
      'default value' +
      '</default>' +
      '</switch>' +
      '</component>'

    return parseJs(template, {}).should.eventually.deep.equal(['default value'])
  })

  it ('switch statement for tags with positive case 1', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={a > b}>' +
      'case 1' +
      '</case>' +
      '</switch>' +
      '</component>'

    return parseJs(template, {a: 2, b: 1}).should.eventually.deep.equal(['case 1'])
  })

  it ('switch statement for tags with negative case 1', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={a > b}>' +
      'case 1' +
      '</case>' +
      '</switch>' +
      '</component>'

    return parseJs(template, {a: 1, b: 2}).should.eventually.deep.equal([])
  })

  it ('switch statement for tags with positive case 2', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={a > b}>' +
      'case 1' +
      '</case>' +
      '<case test={b > a}>' +
      'case 2' +
      '</case>' +
      '</switch>' +
      '</component>'

    return parseJs(template, {a: 1, b: 2}).should.eventually.deep.equal(['case 2'])
  })

  it ('switch statement for tags with positive default statement', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={a > b}>' +
      'case 1' +
      '</case>' +
      '<default>' +
      'default statement' +
      '</default>' +
      '</switch>' +
      '</component>'

    return parseJs(template, {a: 1, b: 2}).should.eventually.deep.equal(['default statement'])
  })

  it ('switch statement for attributes with default', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<default>' +
      '<attribute name="data-id" value="qwerty" />' +
      '</default>' +
      '</switch>' +
      '</div>' +
      '</component>'
    var result = [
      {
        tag: 'div',
        attrs: {
          'data-id': 'qwerty'
        },
        children: []
      }
    ]

    return parseJs(template, {}).should.eventually.deep.equal(result)
  })

  it ('switch statement for attributes with positive case 1', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<case test={a > b}>' +
      '<attribute name="case" value="1" />' +
      '</case>' +
      '</switch>' +
      '</div>' +
      '</component>'
    var result = [
      {
        tag: 'div',
        attrs: {
          case: '1'
        },
        children: []
      }
    ]

    return parseJs(template, {a: 2, b: 1}).should.eventually.deep.equal(result)
  })

  it ('switch statement for attributes with negative case 1', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<case test={a > b}>' +
      '<attribute name="case" value="1" />' +
      '</case>' +
      '</switch>' +
      '</div>' +
      '</component>'
    var result = [
      {
        tag: 'div',
        attrs: {},
        children: []
      }
    ]

    return parseJs(template, {a: 1, b: 2}).should.eventually.deep.equal(result)
  })

  it ('switch statement for attributes with positive case 2', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<case test={a > b}>' +
      '<attribute name="case" value="1" />' +
      '</case>' +
      '<case test={b > a}>' +
      '<attribute name="case" value="2" />' +
      '</case>' +
      '</switch>' +
      '</div>' +
      '</component>'
    var result = [
      {
        tag: 'div',
        attrs: {
          case: '2'
        },
        children: []
      }
    ]

    return parseJs(template, {a: 1, b: 2}).should.eventually.deep.equal(result)
  })

  it ('switch statement for attributes with positive default statement', function () {
    var template =
      '<component>' +
      '<div>' +
      '<switch>' +
      '<case test={a > b}>' +
      '<attribute name="case" value="1" />' +
      '</case>' +
      '<default>' +
      '<attribute name="case" value="default statement" />' +
      '</default>' +
      '</switch>' +
      '</div>' +
      '</component>'
    var result = [
      {
        tag: 'div',
        attrs: {
          case: 'default statement'
        },
        children: []
      }
    ]

    return parseJs(template, {a: 1, b: 2}).should.eventually.deep.equal(result)
  })

  it ('array expressions open range grow up', function () {
    var template =
      '<component>' +
      '<for-each item={item} from={[5...end]}>' +
      '{ item }' +
      '</for-each>' +
      '</component>'
    var result = [
      5,
      6,
      7,
      8
    ]

    return parseJs(template, {end: 9}).should.eventually.deep.equal(result)
  })

  it ('if expression', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={a == b}>' +
      '<variable name={a} value={a + b} />' +
      '</case>' +
      '<case test={a > b && b < a}>' +
      '<variable name={a} value={a - b} />' +
      '</case>' +
      '<default>' +
      '<variable name={a} value={b} />' +
      '</default>' +
      '</switch>' +
      '{a}' +
      '</component>'
    var params = {a: 5, b: 10}

    return parseJs(template, params).should.eventually.deep.equal([10])
  })

  it ('if expression 2', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={a == b}>' +
      '<variable name={a} value={a + b} />' +
      '</case>' +
      '<case test={a > b && b < a}>' +
      '<variable name={a} value={a - b} />' +
      '</case>' +
      '<default>' +
      '<variable name={a} value={b} />' +
      '</default>' +
      '</switch>' +
      '{a}' +
      '</component>'
    var params = {a: 10, b: 5}

    return parseJs(template, params).should.eventually.deep.equal([5])
  })

  it ('array expressions open range grow down', function () {
    var template =
      '<component>' +
      '<for-each item={item} from={[start...5]}>' +
      '{ item }' +
      '</for-each>' +
      '</component>'
    var result = [
      9,
      8,
      7,
      6
    ]

    return parseJs(template, {start: 9}).should.eventually.deep.equal(result)
  })

  it ('array expressions closed range grow up', function () {
    var template =
      '<component>' +
      '<for-each item={item} from={[5..end]}>' +
      '{ item }' +
      '</for-each>' +
      '</component>'
    var result = [
      5,
      6,
      7,
      8,
      9
    ]

    return parseJs(template, {end: 9}).should.eventually.deep.equal(result)
  })

  it ('array expressions closed range grow down', function () {
    var template =
      '<component>' +
      '<for-each item={item} from={[start..5]}>' +
      '{ item }' +
      '</for-each>' +
      '</component>'
    var result = [
      9,
      8,
      7,
      6,
      5
    ]

    return parseJs(template, {start: 9}).should.eventually.deep.equal(result)
  })

  it ('doctype', function () {
    var template =
      '<component>' +
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="UTF-8" />' +
      '<title>Document</title>' +
      '</head>' +
      '<body></body>' +
      '</html>' +
      '</component>'
    var result = [
      {
        tag: '!DOCTYPE',
        children: [],
        attrs: {
          'html': '',
          'PUBLIC': '',
          '"-//W3C//DTD XHTML 1.0 Transitional//EN"': '',
          '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"' : ''
        }
      },
      {
        tag: 'html',
        attrs: {
          'lang': 'en'
        },
        children: [
          {
            tag: 'head',
            attrs: {},
            children: [
              {
                tag: 'meta',
                attrs: {
                  'charset': 'UTF-8'
                },
                children: []
              },
              {
                tag: 'title',
                attrs: {},
                children: ['Document']
              }
            ]
          },
          {
            tag: 'body',
            attrs: {},
            children: []
          }
        ]
      }
    ]

    return parseJs(template).should.eventually.deep.equal(result)
  })

  it ('include with recursive parameters', function () {
    var tempCommentsName = generateName()
    var template =
      '<component>' +
      '<import name="user-comments" from="./' + tempCommentsName + '" />' +
      '<for-each item={comment} from={comments}>' +
      '<div>{ comment[\'name\'] }<div>' +
      '<user-comments comments={ comment.children } />' +
      '</div>' +
      '</div>' +
      '</for-each>' +
      '</component>'
    var data = {
      comments: [
        {
          name: 'Aleksei',
          children: [
            {
              name: 'Natasha',
              children: []
            }
          ]
        }
      ]
    }
    var result = [
      {
        tag: 'div',
        attrs: {},
        children: [
          'Aleksei',
          {
            tag: 'div',
            attrs: {},
            children: [
              {
                tag: 'div',
                attrs: {},
                children: [
                  'Natasha',
                  {
                    tag: 'div',
                    attrs: {},
                    children: []
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

  it ('include with common scope of template and children', function () {
    var tempWrapName = generateName()
    var tempAsideName = generateName()
    var tempName = generateName()
    var wrapTemplate =
      '<component>' +
      '<wrap title={ title }>{children}</wrap>' +
      '</component>'
    var asideTemplate =
      '<component>' +
      '<aside>{ children }<hr />' +
      '</aside>' +
      '</component>'
    var template =
      '<component>' +
      '<import name="wrap-component" from=\'./' + tempWrapName + '\' />' +
      '<import name="aside-component" from=\'./' + tempAsideName + '\' />' +
      '<variable name={variable} value={1} />' +
      '<wrap-component title="Title of Wrap!">' +
      '<aside-component>Text' +
      '<variable name={variable} value={variable + 1} />' +
      '</aside-component>' +
      '</wrap-component>' +
      '{variable}' +
      '</component>'
    var result = [
      {
        tag: 'wrap',
        attrs: {
          'title': 'Title of Wrap!'
        },
        children: [
          {
            tag: 'aside',
            attrs: {},
            children: [
              'Text',
              {
                tag: 'hr',
                attrs: {},
                children: []
              }
            ]
          }
        ]
      },
      2
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
