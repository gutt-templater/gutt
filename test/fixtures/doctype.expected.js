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
var tile;
var _params0 = [];
(function () {
  var _attrValue1 = '';
_params0.push({name: 'html', value: _attrValue1});
})();
(function () {
  var _attrValue2 = '';
_params0.push({name: 'PUBLIC', value: _attrValue2});
})();
(function () {
  var _attrValue3 = '';
_attrValue3 += '-//W3C//DTD XHTML 1.0 Transitional//EN';
_params0.push({name: 'undefined', value: _attrValue3});
})();
(function () {
  var _attrValue4 = '';
_attrValue4 += 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd';
_params0.push({name: 'undefined', value: _attrValue4});
})();
_childs.push(create('!DOCTYPE', _params0));
_childs.push(create('\n'));
var _params5 = [];
(function () {
  var _attrValue6 = '';
_attrValue6 += 'en';
_params5.push({name: 'lang', value: _attrValue6});
})();
_childs.push(create('html', _params5, function (_childs) {
_childs.push(create('\n'));
var _params7 = [];
_childs.push(create('head', _params7, function (_childs) {
_childs.push(create('\n  '));
var _params8 = [];
(function () {
  var _attrValue9 = '';
_attrValue9 += 'UTF-8';
_params8.push({name: 'charset', value: _attrValue9});
})();
_childs.push(create('meta', _params8));
_childs.push(create('\n  '));
var _params10 = [];
_childs.push(create('title', _params10, function (_childs) {
_childs.push(create('Document'));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));
var _params11 = [];
_childs.push(create('body', _params11, function (_childs) {
_childs.push(create('\n  '));
var _params12 = [];
(function () {
  var _attrValue13 = '';
_attrValue13 += 'advices';
_params12.push({name: 'class', value: _attrValue13});
})();
_childs.push(create('div', _params12, function (_childs) {
_childs.push(create('\n    '));
var _params14 = [];
(function () {
  var _attrValue15 = '';
_attrValue15 += 'head';
_params14.push({name: 'class', value: _attrValue15});
})();
_childs.push(create('h1', _params14, function (_childs) {
}));
_childs.push(create('\n\n    '));
var _params16 = [];
(function () {
  var _attrValue17 = '';
_attrValue17 += 'tiles';
_params16.push({name: 'class', value: _attrValue17});
})();
_childs.push(create('div', _params16, function (_childs) {
_childs.push(create('\n      '));
var _params18 = [];
(function () {
  var _attrValue19 = '';
_attrValue19 += 'tiles';
_params18.push({name: 'class', value: _attrValue19});
})();
_childs.push(create('div', _params18, function (_childs) {
_childs.push(create('\n        '));
for (data['tile'] in data['tiles']) {
data['tile'] = data['tiles'][data['tile']];
_childs.push(create('\n        '));
var _params20 = [];
(function () {
  var _attrValue21 = '';
_attrValue21 += 'tiles__tile';
if (data['tile']["active"]) {
_attrValue21 += ' tile--active';
}
_params20.push({name: 'class', value: _attrValue21});
})();
_childs.push(create('div', _params20, function (_childs) {
_childs.push(create(data['tile']["name"]));
}));
_childs.push(create('\n        '));
}
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n\n    '));
var _params22 = [];
(function () {
  var _attrValue23 = '';
_attrValue23 += 'footer';
_params22.push({name: 'class', value: _attrValue23});
})();
_childs.push(create('div', _params22, function (_childs) {
_childs.push(create('\n      '));
var _params24 = [];
(function () {
  var _attrValue25 = '';
_attrValue25 += 'footer';
_params24.push({name: 'class', value: _attrValue25});
})();
_childs.push(create('div', _params24, function (_childs) {
_childs.push(create('\n        '));
var _params26 = [];
(function () {
  var _attrValue27 = '';
_attrValue27 += 'copy';
if (data['a'] > data['b']) {
_attrValue27 += ' active';
}
_params26.push({name: 'class', value: _attrValue27});
})();
_childs.push(create('span', _params26, function (_childs) {
}));
_childs.push(create('\n        '));
var _params28 = [];
(function () {
  var _attrValue29 = '';
_attrValue29 += 'phone';
_params28.push({name: 'class', value: _attrValue29});
})();
_childs.push(create('span', _params28, function (_childs) {
}));
_childs.push(create('\n        '));
var _params30 = [];
(function () {
  var _attrValue31 = '';
_attrValue31 += 'email';
_params30.push({name: 'class', value: _attrValue31});
})();
_childs.push(create('span', _params30, function (_childs) {
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));
}));
    return _childs;
  };
});