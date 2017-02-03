var htmlParser = require('./parsers/html-parser').parser
var phpStringifier = require('./php-stringifier')

// var template =
//   '<define-component>' +
//   '  <content>' +
//   '    <div id="attr" checked data-role={role} data-id={id?}>' +
//   '     <x:param name="selected" value="str_len(name)" />' +
//   '      <!-- comment --> with text' +
//   '    </div>' +
//   '  </content>' +
//   '</define-component>'

var template =
  '<div selected data-role="lalala" {name}={name}>' +
  '  <x:param name="id" value="userid" />' +
  '  <x:param name={uid} value={userid} />' +
  // '  <input/>' +
//  '    <x:param name="type" value="text" />' +
//  '  </input>' +
  '</div>'

var result = phpStringifier(htmlParser.parse(template))

console.log(result)
