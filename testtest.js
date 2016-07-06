var parser = require('./test').parser
var fs = require('fs')

var testfile = fs.readFileSync(__dirname + '/test/test.txt', 'utf8')
console.log(testfile);

var result = parser.parse(testfile);

result.forEach(function (item) {
  console.log(item);
  if (item.attrs) {
    item.attrs.forEach(function (attr) {
      console.log(attr.value);
    })
  }
});
