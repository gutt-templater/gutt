var htmlParser = require('./parsers/html-parser').parser
var phpStringifier = require('./php-stringifier/php-stringifier')
var fs = require('fs')
var exec = require('child_process').exec

// var template =
//   '<define-component>' +
//   '  <content>' +
//   '    <div id="attr" checked data-role={role} data-id={id?}>' +
//   '     <x:param name="selected" value="str_len(name)" />' +
//   '      <!-- comment --> with text' +
//   '    </div>' +
//   '  </content>' +
//   '</define-component>'

var checkboxTemplate =
  '<define-component>' +
  '  <model>' +
  '    <content name="id">default-id</content>' +
  '    <content name="name">default-name</content>' +
  '  </model>' +
  '  <template>' +
  '    <label for={id}></label>' +
  '    <input type="checkbox" name={name} id={id} />' +
  '    {children}' +
  '  </template>' +
  '</define-component>'

var checkboxResult = phpStringifier(htmlParser.parse(checkboxTemplate))

var testTemplate =
  '<define-component>' +
  '  <x:import name="checkbox" from="./checkbox-template" />' +
  '  <div selected data-role="lalala" {name}={name}>' +
  '    <x:for key={index} value={number} from={[1..6]}>' +
  '      <x:if test={index / 2 == 1}>' +
  '        <x:param name={"data-index" ++ index} value={number * 2} />' +
  '      </x:if>' +
  '    </x:for>' +
  '    <x:param name={uid} value={userid} />' +
  '    <x:if test={a > b}>' +
  '      <input>' +
  '        <x:param name="type" value="text" />' +
  '      </input>' +
  '    </x:if>' +
  '    <x:checkbox id="agree-box-id" name="agree-box">' +
  '      <span>{a}</span>' +
  '      <x:var name={a} value={a + 4} />' +
  '    </x:checkbox>' +
'      <span>{a}</span>' +
  '  </div>' +
  '</define-component>'

var testResult = phpStringifier(htmlParser.parse(testTemplate))
var testTemplatePath = __dirname + '/tmp/test-template.php'
var params = {
  name: 'Alex',
  uid: 'unique123',
  userid: '456',
  a: 6,
  b: 5
}

fs.writeFileSync(__dirname + '/tmp/checkbox-template.php', checkboxResult)
fs.writeFileSync(testTemplatePath, testResult)

exec('php ./test/helpers/run-template.php ' + testTemplatePath + ' \'' + JSON.stringify(params) + '\'', function (err, res) {
  if (err) {
    console.error(err)
  } else {
    console.log(res)
  }
})
