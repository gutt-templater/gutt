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
var index;
_childs.push(create('\n\n'));
for (data['index'] in data['comments']) {
data['comment'] = data['comments'][data['index']];
_childs.push(create('\n'));
var _params0 = [];
(function () {
  var _attrValue1 = '';
_attrValue1 += 'comment';
_params0.push({name: 'class', value: _attrValue1});
})();
(function () {
  var _attrValue2 = '';
_attrValue2 += data['index'];
_params0.push({name: 'data-index', value: _attrValue2});
})();
_childs.push(create('div', _params0, function (_childs) {
_childs.push(create('\n  '));
var _params3 = [];
(function () {
  var _attrValue4 = '';
_attrValue4 += 'name';
_params3.push({name: 'class', value: _attrValue4});
})();
_childs.push(create('div', _params3, function (_childs) {
_childs.push(create(data['comment']["name"]));
_childs.push(create(', '));
var _params5 = [];
(function () {
  var _attrValue6 = '';
_attrValue6 += 'date';
_params5.push({name: 'class', value: _attrValue6});
})();
_childs.push(create('span', _params5, function (_childs) {
_childs.push(create(data['comment']["date"]));
}));
}));
_childs.push(create('\n  '));
var _params7 = [];
(function () {
  var _attrValue8 = '';
_attrValue8 += 'message';
_params7.push({name: 'class', value: _attrValue8});
})();
_childs.push(create('div', _params7, function (_childs) {
_childs.push(create(data['comment']["message"]));
}));
_childs.push(create('\n  '));
var _params9 = [];
(function () {
  var _attrValue10 = '';
_attrValue10 += 'childs';
_params9.push({name: 'class', value: _attrValue10});
})();
_childs.push(create('div', _params9, function (_childs) {
_childs.push(create('\n    '));
var _Comments = require('/Users/makingoff/Projects/html-parser/test/fixtures/comments');
var _includeChilds12 = [];
;
var _resultChilds11 = _Comments({'comments': data['comment']["childs"]}, _includeChilds12);
_resultChilds11.forEach(function (child) {
_childs.push(create(child));
});
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));
}
    return _childs;
  };
});