var parser = require('./index')
var jsStringifier = require('./js-stringifier/js-stringifier')

var template =
  '<component>' +
  '<for-each key={index} item={item} from={news}>' +
  '<h1 data-index={index}>{item[\'title\']}</h1>' +
  '</for-each>' +
  '</component>'

console.log(parser.parse(template).stringifyWith(jsStringifier));
