module.exports = {
  prefix:
    '(function (factory) {\n' +
    '  if (typeof module !== \'undefined\' && typeof module.exports !== \'undefined\') {\n' +
    '    module.exports = factory();\n' +
    '  } else if (typeof define !== \'undefined\' && typeof define.amd !== \'undefined\') {\n' +
    '    define([], factory());\n' +
    '  }\n' +
    '})(function () {\n' +
    '  var MKARR_OPEN = 2 << 1;\n' +
    '  var MKARR_CLOSE = 1 << 1;\n' +
    '  function mkArr(start, end, flag) {\n' +
    '    var arr = [], i;\n' +
    '    if (flag & MKARR_OPEN) {\n' +
    '      if (start <= end) {\n' +
    '        for (i = start; i < end; i++) {\n' +
    '          arr.push(i);\n' +
    '        }\n' +
    '      } else {\n' +
    '        for (i = start; i > end; i--) {\n' +
    '          arr.push(i);\n' +
    '        }\n' +
    '      }\n' +
    '    } else if (flag & MKARR_CLOSE) {\n' +
    '      if (start <= end) {\n' +
    '        for (i = start; i <= end; i++) {\n' +
    '          arr.push(i);\n' +
    '        }\n' +
    '      } else {\n' +
    '        for (i = start; i >= end; i--) {\n' +
    '          arr.push(i);\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '    return arr;\n' +
    '  }\n' +
    '  function str(str, len, sprtr) {\n' +
    '    if (!len) len = 0;\n' +
    '    if (typeof str.toString === \'function\') str = str.toString();\n' +
    '    if (!sprtr) sprtr = \'.\';\n' +
    '    if (~str.indexOf(\'.\')) {\n' +
    '      if (len > 0) {\n' +
    '        str = str.substr(0, str.indexOf(\'.\') + len + 1);\n' +
    '      } else {\n' +
    '        str = str.substr(0, str.indexOf(\'.\') + len);\n' +
    '      }\n' +
    '    } else {\n' +
    '      str = str_pad(str + \'.\', str.length + 1 + len, \'0\');\n' +
    '    }\n' +
    '    return str.replace(\'.\', sprtr);\n' +
    '  }\n' +
    '  function str_replace(str, src, rep) {\n' +
    '    while (~str.indexOf(src)) {\n' +
    '      str = str.replace(src, rep);\n' +
    '    }\n' +
    '    return str;\n' +
    '  }\n' +
    '  var STRPADRIGHT = 1 << 1;\n' +
    '  var STRPADLEFT = 2 << 1;\n' +
    '  var STRPADBOTH = 4 << 1;\n' +
    '  function __str_pad_repeater(str, len) {\n' +
    '    var collect = \'\', i;\n' +
    '    while(collect.length < len) collect += str;\n' +
    '    collect = collect.substr(0, len);\n' +
    '    return collect;\n' +
    '  }\n' +
    '  function str_pad(str, len, sub, type) {\n' +
    '    if (typeof type === \'undefined\') type = STRPADRIGHT;\n' +
    '    var half = \'\', pad_to_go;\n' +
    '    if ((pad_to_go = len - str.length) > 0) {\n' +
    '      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }\n' +
    '      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }\n' +
    '      else if (type & STRPADBOTH) {\n' +
    '        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));\n' +
    '        str = half + str + half;\n' +
    '        str = str.substr(0, len);\n' +
    '      }\n' +
    '    }\n' +
    '    return str;\n' +
    '  }\n' +
    '  function str_htmlescape(html) {\n' +
    '    return html.replace(/&/g, "&amp;")\n' +
    '    .replace(/\\</g, "&lt;")\n' +
    '    .replace(/\\>/g, "&gt;")\n' +
    '    .replace(/\\"/g, "&quot;");\n' +
    '  }\n' +
    '  function str_upfirst(str) {\n' +
    '    return str.split(/[\\s\\n\\t]+/).map(function (item) {\n' +
    '      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();\n' +
    '    }).join(\' \');\n' +
    '  }\n' +
    '  function str_camel(str) {\n' +
    '    return str.split(/[\\s\\n\\t]+/).map(function (item, index) {\n' +
    '      if (!index) return item;\n' +
    '      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();\n' +
    '    }).join(\'\');\n' +
    '  }\n' +
    '  function str_kebab(str) {\n' +
    '    return str.split(/[\\s\\n\\t]+/).join(\'-\');\n' +
    '  }\n' +
    '  function arr_values(obj) {\n' +
    '    var values = [], i;\n' +
    '    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);\n' +
    '    return values;\n' +
    '  }\n' +
    '  function arr_contain(obj, value) {\n' +
    '    if(typeof obj.indexOf === \'function\') return obj.indexOf(value) !== -1;\n' +
    '    var i;\n' +
    '    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;\n' +
    '    return false;\n' +
    '  }\n' +
    '  function arr_len(obj) {\n' +
    '    if(typeof obj.length !== \'undefined\') return obj.length;\n' +
    '    var i, length = 0;\n' +
    '    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;\n' +
    '    return length;\n' +
    '  }\n' +
    '  function arr_push(arr, value) {\n' +
    '    arr.push(value);\n' +
    '    return \'\';\n' +
    '  }\n' +
    '  function arr_unshift(arr, value) {\n' +
    '    arr.unshift(value);\n' +
    '    return \'\';\n' +
    '  }\n' +
    '  function arr_rand(arr, value) {\n' +
    '    var keys = Object.keys(arr);\n' +
    '    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];\n' +
    '  }\n' +
    '  function arr_splice(arr, st, en, els) {\n' +
    '    var prms = [st];\n' +
    '    if (typeof en !== \'undefined\') prms.push(en);\n' +
    '    return Array.prototype.splice.apply(arr, prms.concat(els));\n' +
    '  }\n' +
    '  function arr_pad(src, len, el) {\n' +
    '    var i, arr = src.slice(0);\n' +
    '    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);\n' +
    '    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);\n' +
    '    return arr;\n' +
    '  }\n' +
    '  function arr_reverse(src) {\n' +
    '    var arr = src.slice(0);\n' +
    '    arr.reverse();\n' +
    '    return arr;\n' +
    '  }\n' +
    '  function arr_sort(src) {\n' +
    '    var arr = src.slice(0);\n' +
    '    arr.sort();\n' +
    '    return arr;\n' +
    '  }\n' +
    '  function arr_sort_reverse(src) {\n' +
    '    var arr = src.slice(0);\n' +
    '    arr.sort();\n' +
    '    arr.reverse();\n' +
    '    return arr;\n' +
    '  }\n' +
    '  function arr_unique(src) {\n' +
    '    var i, arr = [];\n' +
    '    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);\n' +
    '    return arr;\n' +
    '  }\n' +
    '  function arr_key(arr, value) {\n' +
    '    var i;\n' +
    '    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;\n' +
    '    return -1;\n' +
    '  }\n' +
    '  function __create(name, attrs, cb) {\n' +
    '    if (typeof name === \'object\') return name;\n' +
    '    var children = [];\n' +
    '    if (typeof cb === \'function\') cb(children);\n' +
    '    if (attrs) {\n' +
    '      return {\n' +
    '        tag: name,\n' +
    '        attrs: attrs,\n' +
    '        children: children.filter(function (_child) { return _child !== null; })\n' +
    '      };\n' +
    '    }\n' +
    '    if (typeof name.toString === \'function\') name = name.toString();\n' +
    '    return name;\n' +
    '  }\n' +
    '  return function (__data, ___children) {\n' +
    '    var __state;\n' +
    '    if (typeof __data !== \'object\') __state = __data;\n' +
    '    else\n' +
    '      if (Object.prototype.toString.call(__data) === \'[object Array]\')\n' +
    '        __state = [].concat(__data);\n' +
    '      else {' +
    '        __state = {};\n' +
    '        var __key;\n' +
    '        for (__key in __data) if (Object.prototype.hasOwnProperty.call(__data, __key))\n' +
    '          __state[__key] = __data[__key];\n' +
    '      }\n' +
    '    var __children = [];\n',
  postfix:
    '    return __children;\n' +
    '  };\n' +
    '});'
}
