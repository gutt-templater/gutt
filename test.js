var parser = require('./parsers/parser')
var phpStringifier = require('./php-stringifier/php-stringifier')
var fs = require('fs')
var exec = require('child_process').exec

var checkboxTemplate =
  '<x-component>\n' +
  '  <x-model>\n' +
  '    <x-var name={id} value="default-id" />\n' +
  '    <x-var name={name} value="default-name" />\n' +
  '  </x-model>\n' +
  '  <x-template>\n' +
  '    <label for={id}></label>\n' +
  '    <input type="checkbox" name={name} id={id} />\n' +
  '    {children}\n' +
  '  </x-template>' +
  '</x-component>'

var checkboxResult = parser.parse(checkboxTemplate).stringifyWith(phpStringifier)

var testTemplate =
  '<x-component>\n' +
  '  <x-import name="checkbox" from="./checkbox-template" />\n' +
  '  <x-model>\n' +
  '    <x-var name={name} value="default-name" />\n' +
  '    <x-var name={arr} value={[1..6]} />\n' +
  '    <x-var name={uid} value="default-uid" />\n' +
  '    <x-var name={userid} value="123456" />\n' +
  '    <x-var name={a} value="2" />\n' +
  '    <x-var name={b} value="3" />\n' +
  '  </x-model>\n' +
  '  <x-template>\n' +
  '    <div selected data-role="lalala" {name}={name}>\n' +
  '      <x-for key={index} value={number} from={arr}>\n' +
  '        <x-if test={index / 2 == 1}>\n' +
  '          <x-param name={"data-index" ++ index} value={number * 2} />\n' +
  '        </x-if>\n' +
  '      </x-for>\n' +
  '      <x-param name={uid} value={userid} />\n' +
  '      <x-if test={a > b}>\n' +
  '        <input>\n' +
  '          <x-param name="type" value="text" />\n' +
  '        </input>\n' +
  '      </x-if>\n' +
  '      <x-checkbox id="agree-box-id" name="agree-box">\n' +
  '        <span>{a}</span>\n' +
  '        <x-var name={a} value={a + 4} />\n' +
  '      </x-checkbox>\n' +
  '      <span>{a}</span>\n' +
  '    </div>\n' +
  '  </x-template>\n' +
  '</x-component>'

var testResult = parser.parse(testTemplate).stringifyWith(phpStringifier)

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
