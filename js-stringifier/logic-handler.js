var consts = [
  'true',
  'false',
  'MKARR_OPEN',
  'MKARR_CLOSE',
  'STRPADRIGHT',
  'STRPADLEFT',
  'STRPADBOTH'
]

function handleParams (params) {
  return params.map(function (attr) {
    return expression(attr)
  })
}

function handleFunction (tree) {
  var strParam
  var funcName
  var params

  funcName =
    (tree.value.type === 'var' && !tree.value.keys.length ? tree.value.value : expression(tree.value))

  switch (funcName) {
    case 'str_sub':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      if (params[1]) {
        params[1] = '(' + params[1] + ' < 0 ? ' + strParam + '.length  + (' + params[1] + ') - ' + params[0] + ' : ' + params[1] + ')'
      }

      return strParam + '.substr(' + params.join(', ') + ')'
    case 'str_len':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.length'
    case 'str_pos':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.indexOf(' + params.join(', ') + ')'
    case 'str_split':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.split(' + params.join(', ') + ')'
    case 'str_lower':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.toLowerCase()'
    case 'str_upper':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.toUpperCase()'
    case 'str_trim':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.trim()'
    case 'str_ltrim':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.replace(/^[\\s\\n\\t]*/, \'\')'
    case 'str_rtrim':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.replace(/[\\s\\n\\t]*$/, \'\')'
    case 'str_urlencode':
      return 'encodeURIComponent(' + handleParams(tree.attrs).join(', ') + ')'
    case 'str_urldecode':
      return 'decodeURIComponent(' + handleParams(tree.attrs).join(', ') + ')'

    case 'arr_keys':
      return 'Object.keys(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_values':
      return 'arr_values(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_pop':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.pop()'
    case 'arr_shift':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return strParam + '.shift()'
    case 'arr_slice':
      params = handleParams(tree.attrs)
      strParam = params.shift()
      if (params[1]) params[1] = parseInt(params[0], 10) + parseInt(params[1], 10)

      return strParam + '.slice(' + params.join(', ') + ')'

    case 'num_int':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return 'parseInt(' + strParam + ', 10)'
    case 'num_float':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return 'parseFloat(' + strParam + ')'
    case 'num_pow':
      return 'Math.pow(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_abs':
      return 'Math.abs(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_sin':
      return 'Math.sin(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_cos':
      return 'Math.cos(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_tan':
      return 'Math.tan(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_acos':
      return 'Math.acos(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_asin':
      return 'Math.asin(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_atan':
      return 'Math.atan(' + handleParams(tree.attrs).join(', ') + ')'
    case 'num_round':
      params = handleParams(tree.attrs)
      strParam = params.shift()

      return '(' + strParam + ' < 0 ? Math.round(' + strParam + ') : Math.round(' + strParam + '))'
    case 'num_rand':
      return 'Math.random()'
    case 'num_sqrt':
      return 'Math.sqrt(' + handleParams(tree.attrs).join(', ') + ')'
    default:
      return funcName + '(' + handleParams(tree.attrs).join(', ') + ')'
  }
}

function handleArray (source) {
  var key = 0
  var isKeyProper = true
  var result = []
  var str = ''

  source.forEach(function (item) {
    if (item.key !== null) {
      isKeyProper = false;
    }
  })

  if (isKeyProper) {
    source.forEach(function (item) {
      result.push(expression(item.value))
    })

    return '[' + result.join(',') + ']'
  }

  result = {}

  source.forEach(function (item) {
    if (item.key === null) {
      result[key++] = expression(item.value)
    } else {
      result[expression(item.key)] = expression(item.value)
    }
  })

  str = []

  for (key in result) {
    str.push('_arr[' + key + '] = ' + result[key] + ';')
  }

  return '(function () { var _arr = {}; ' + str.join(' ') + ' return _arr;})()'
}

function prepareVariableKey (key) {
  switch (key.type) {
    case 'num':
    case 'var':
      return expression(key);
    case 'str':
      return '\'' + expression(key.value) + '\'';
  }
}

function expression (tree) {
  var str = ''
  var keys

  if (typeof tree === 'string') return tree

  switch (tree.type) {
    case 'var':
      if (~consts.indexOf(tree.value)) return tree.value

      keys = [{type: 'str', value: tree.value}].concat(tree.keys);

      str += '__state' + keys.map(function (key) {
        return '[' + prepareVariableKey(key) + ']'
      }).join('')

      return str

    case 'str':
      return expression('"' + tree.value + '"')

    case 'num':
      str += tree.value

      return str
    case 'leftshift':
      str += expression(tree.value[0]) + ' << ' + expression(tree.value[1])

      return str
    case 'rightshift':
      str += expression(tree.value[0]) + ' >> ' + expression(tree.value[1])

      return str
    case 'plus':
      str += expression(tree.value[0]) + ' + ' + expression(tree.value[1])

      return str
    case 'minus':
      str += expression(tree.value[0]) + ' - ' + expression(tree.value[1])

      return str
    case 'mult':
      str += expression(tree.value[0]) + ' * ' + expression(tree.value[1])

      return str
    case 'divis':
      str += expression(tree.value[0]) + ' / ' + expression(tree.value[1])

      return str
    case 'or':
      str += expression(tree.value[0]) + ' || ' + expression(tree.value[1])

      return str
    case 'and':
      str += expression(tree.value[0]) + ' && ' + expression(tree.value[1])

      return str
    case 'bitor':
      str += expression(tree.value[0]) + ' | ' + expression(tree.value[1])

      return str
    case 'bitand':
      str += expression(tree.value[0]) + ' & ' + expression(tree.value[1])

      return str
    case 'notequal':
      str += expression(tree.value[0]) + ' != ' + expression(tree.value[1])

      return str
    case 'equal':
      str += expression(tree.value[0]) + ' == ' + expression(tree.value[1])

      return str
    case 'gtequal':
      str += expression(tree.value[0]) + ' >= ' + expression(tree.value[1])

      return str
    case 'gt':
      str += expression(tree.value[0]) + ' > ' + expression(tree.value[1])

      return str
    case 'lt':
      str += expression(tree.value[0]) + ' < ' + expression(tree.value[1])

      return str
    case 'ltequal':
      str += expression(tree.value[0]) + ' <= ' + expression(tree.value[1])

      return str
    case 'isset':
      str += 'isset(' + expression(tree.value) + ')'

      return str
    case 'not':
      str += '!' + expression(tree.value)

      return str
    case 'brack':
      str += '(' + expression(tree.value) + ')'

      return str
    case 'uminus':
      str += '-' + expression(tree.value)

      return str
    case 'func':
      str = handleFunction(tree)

      return str
    case 'concat':
      return tree.value.map(function (item) {
        return expression(item)
      }).join(' + ')

    case 'array':
      if (tree.range) {
        switch (tree.range.type) {
          case 'empty':
            return '[]'

          case 'open':
            str = 'mkArr(' + expression(tree.range.value[0])
            str += ', ' + expression(tree.range.value[1])
            str += ', MKARR_OPEN)'

            return str

          case 'close':
            str = 'mkArr(' + expression(tree.range.value[0])
            str += ', ' + expression(tree.range.value[1])
            str += ', MKARR_CLOSE)'

            return str
        }
      }

      return handleArray(tree.values)
  }

  return str
}

function logicHandler (node) {
  var value

  if (node.expr.type === 'isset') {
    value = expression(node.expr.value)
    return '(isset(' + value + ') ? ' + value + ' : "" )'
  }

  return expression(node.expr)
}

module.exports = logicHandler
