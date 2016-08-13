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
    return _childs;
  };
});