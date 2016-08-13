(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  function create(name, attrs, cb) {
    if (typeof name !== 'string') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs
      };
    }
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
_childs.push(create('\n'));
_childs.push(create('\n\n'));
data['value'] = "Hello";
_childs.push(create('\n\n'));
var _params0 = [];
_childs.push(create('section', _params0, function (_childs) {
_childs.push(create('\n  '));
var _Wrapper = require('/Users/makingoff/Projects/html-parser/test/fixtures/wrapper');
var _includeChilds2 = [];
_includeChilds2.push(create('\n    '));
var _Wrapper2 = require('/Users/makingoff/Projects/html-parser/test/fixtures/wrapper2');
var _includeChilds4 = [];
_includeChilds4.push(create('\n      '));
data['value'] = data['value'] + ", Alex";
_includeChilds4.push(create('\n      '));
var _params5 = [];
(function () {
  var _attrValue6 = '';
_attrValue6 += 'text';
_params5.push({name: 'type', value: _attrValue6});
})();
(function () {
  var _attrValue7 = '';
_attrValue7 += data['value'];
_params5.push({name: 'value', value: _attrValue7});
})();
_includeChilds4.push(create('input', _params5));
_includeChilds4.push(create('\n    '));
;
var _resultChilds3 = _Wrapper2({}, _includeChilds4);
_resultChilds3.forEach(function (child) {
_includeChilds2.push(create(child));
});
_includeChilds2.push(create('\n  '));
;
var _resultChilds1 = _Wrapper({'title': 'Super form'}, _includeChilds2);
_resultChilds1.forEach(function (child) {
_childs.push(create(child));
});
_childs.push(create('\n'));
}));
_childs.push(create('\n'));
var _params8 = [];
_childs.push(create('h1', _params8, function (_childs) {
_childs.push(create(data['value']));
}));
    return _childs;
  };
});