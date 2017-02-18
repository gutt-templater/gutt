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

  it ('html empty comment', function () {
    return parsePhp('<component><!----></component>').should.eventually.equal('<!---->')
  })

  it ('html text comment', function () {
    return parsePhp('<component><!-- some text 12345 _ # $ % ! - -\\- = [ ] \{ \} + ; : ( ) " \' \ / ~ _#$%!-\\-=+;:()"\'\/~ qwe123:-_ --></component>')
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

    return parsePhp('<component>{ b + c[d][\'str\'] * 2 }</component>', params).should.eventually.equal('7')
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
      '<component>' +
      '<for-each key={index} item={item} from={news}>' +
      '<h1 data-index={index}>{item[\'title\']}</h1>' +
      '</for-each>' +
      '</component>'

    return parsePhp(template, params)
      .should.eventually.equal('<h1 data-index="0">News</h1><h1 data-index="1">Olds</h1>')
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
    var result =
      '<input title="Hello" data-index0="0" data-index1="1" data-index2="2" data-index3="3" />'

    return parsePhp(template).should.eventually.equal(result)
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

    return parsePhp(template, {item: 2}).should.eventually.equal('<div title="Hello" data-index0="0" data-index1="1" data-index2="2" data-index3="3"></div>')
  })

  it ('switch statement for tags with default', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<default>default value</default>' +
      '</switch>' +
      '</component>'

    return parsePhp(template, {}).should.eventually.equal('default value')
  })

  it ('switch statement for tags with positive case 1', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={a > b}>case 1</case>' +
      '</switch>' +
      '</component>'

    return parsePhp(template, {a: 2, b: 1}).should.eventually.equal('case 1')
  })

  it ('switch statement for tags with negative case 1', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={a > b}>case 1</case>' +
      '</switch>' +
      '</component>'

    return parsePhp(template, {a: 1, b: 2}).should.eventually.equal('')
  })

  it ('switch statement for tags with positive case 2', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={a > b}>case 1</case>' +
      '<case test={b > a}>case 2</case>' +
      '</switch>' +
      '</component>'

    return parsePhp(template, {a: 1, b: 2}).should.eventually.equal('case 2')
  })

  it ('switch statement for tags with positive default statement', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={a > b}>case 1</case>' +
      '<default>default statement</default>' +
      '</switch>' +
      '</component>'

    return parsePhp(template, {a: 1, b: 2}).should.eventually.equal('default statement')
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

    return parsePhp(template, {}).should.eventually.equal('<div data-id="qwerty"></div>')
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

    return parsePhp(template, {a: 2, b: 1}).should.eventually.equal('<div case="1"></div>')
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

    return parsePhp(template, {a: 1, b: 2}).should.eventually.equal('<div></div>')
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

    return parsePhp(template, {a: 1, b: 2}).should.eventually.equal('<div case="2"></div>')
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

    return parsePhp(template, {a: 1, b: 2}).should.eventually.equal('<div case="default statement"></div>')
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

    return parsePhp(template, params).should.eventually.equal('10')
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

    return parsePhp(template, params).should.eventually.equal('5')
  })

  it ('array expressions open range grow up', function () {
    var template =
      '<component>' +
      '<for-each item={item} from={[5...end]}>' +
      '{ item }' +
      '</for-each>' +
      '</component>'

    return parsePhp(template, {end: 9}).should.eventually.equal('5678')
  })

  it ('array expressions open range grow down', function () {
    var template =
      '<component>' +
      '<for-each item={item} from={[5...end]}>' +
      '{ item }' +
      '</for-each>' +
      '</component>'

    return parsePhp(template, {end: 0}).should.eventually.equal('54321')
  })

  it ('array expressions closed range grow up', function () {
    var template =
      '<component>' +
      '<for-each item={item} from={[5..end]}>' +
      '{ item }' +
      '</for-each>' +
      '</component>'

    return parsePhp(template, {end: 9}).should.eventually.equal('56789')
  })

  it ('array expressions closed range grow down', function () {
    var template =
      '<component>' +
      '<for-each item={item} from={[5..end]}>' +
      '{ item }' +
      '</for-each>' +
      '</component>'

    return parsePhp(template, {end: 0}).should.eventually.equal('543210')
  })

  it ('doctype', function () {
    var template =
      '<component>' +
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >' +
      '<html lang="en"><head><meta charset="UTF-8" />' +
      '<title>Document</title>' +
      '</head>' +
      '<body></body>' +
      '</html>' +
      '</component>'
    var result =
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="UTF-8" />' +
      '<title>Document</title>' +
      '</head>' +
      '<body>' +
      '</body>' +
      '</html>'

    return parsePhp(template).should.eventually.equal(result)
  })

  it ('isset', function () {
    var template =
      '<component>' +
      '<switch>' +
      '<case test={!field[\'hide\']? || (field[\'hide\']? && !field[\'hide\'])}>hidden</case>' +
      '<default>show</default>' +
      '</switch>' +
      '</component>'

    return parsePhp(template, {field: {}}).should.eventually.equal('hidden')
  })

  it ('param with default value', function () {
    var template =
      '<component>' +
      '<param name={a} value={1} />' +
      '<switch>' +
      '<case test={a > b}>first</case>' +
      '<default>default</default>' +
      '</switch>' +
      '</component>'

    return parsePhp(template, {b: 2}).should.eventually.equal('default')
  })

  it ('param with rewritten value', function () {
    var template =
      '<component>' +
      '<param name={a} value={3} />' +
      '<switch>' +
      '<case test={a > b}>first</case>' +
      '<default>default</default>' +
      '</switch>' +
      '</component>'

    return parsePhp(template, {b: 2}).should.eventually.equal('first')
  })

  it ('import and inlude', function () {
    var tempAsideName = generateName()

    return parsePhpAndWriteFile('<component><aside>{children}</aside></component>', tempAsideName + '.php')
      .then(function () {
        var template =
          '<component>' +
          '<import name="aside-component" from="./' + tempAsideName + '" />' +
          '<div>' +
          '<aside-component>' +
          '<h1>Hello</h1>' +
          '</aside-component>' +
          '</div>' +
          '</component>'

        return parsePhp(template)
      })
      .should.eventually.equal('<div><aside><h1>Hello</h1></aside></div>')
  })

  it ('include with recursive parameters for single tag', function () {
    var tempCommentsName = generateName()
    var template =
      '<component>' +
      '<import name="user-comments" from="./' + tempCommentsName + '" />' +
      '<for-each item={comment} from={comments}>' +
      '<div>' +
      '{comment.name}' +
      '<div>' +
      '<user-comments comments={comment.children} />' +
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

    return parsePhpAndWriteFile(template, tempCommentsName + '.php')
      .then(function () {
        return runPhpTemplate(tempCommentsName, data)
      })
      .should.eventually.equal('<div>Aleksei<div><div>Natasha<div></div></div></div></div>')
  })

  it ('include with recursive parameters for couple tag', function () {
    var tempCommentsName = generateName()
    var template =
      '<component>' +
      '<import name="user-comments" from="./' + tempCommentsName + '" />' +
      '<for-each item={comment} from={comments}>' +
      '<div>' +
      '{comment[\'name\']}' +
      '<div>' +
      '<user-comments comments={comment[\'children\']}></user-comments>' +
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

    return parsePhpAndWriteFile(template, tempCommentsName + '.php')
      .then(function () {
        return runPhpTemplate(tempCommentsName, data)
      })
      .should.eventually.equal('<div>Aleksei<div><div>Natasha<div></div></div></div></div>')
  })

  it ('include with common scope of template and children', function () {
    var tempWrapName = 'tmp' + generateName()
    var tempAsideName = 'tmp' + generateName()
    var tempName = 'tmp' + generateName()
    var wrapTemplate =
      '<component>' +
      '<wrap title={title}>{children}</wrap>' +
      '</component>'
    var asideTemplate =
      '<component>' +
      '<aside>{children}<hr />' +
      '</aside>' +
      '</component>'
    var template =
      '<component>' +
      '<import name="wrap-component" from="./' + tempWrapName + '" />' +
      '<import name="aside-component" from="./' + tempAsideName + '" />' +
      '<variable name={variable} value={1} />' +
      '<wrap-component title="Title of Wrap!">' +
      '<aside-component>' +
      'Text' +
      '<variable name={variable} value={variable + 1} />' +
      '</aside-component>' +
      '</wrap-component>' +
      '{variable}' +
      '</component>'

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
