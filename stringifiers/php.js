var consts = ['true', 'false']
var prefix = '<?php\n' +
'if (!defined(\'MKARR_OPEN\')) {\n' +
'  define(\'MKARR_OPEN\', 2 >> 1);\n' +
'}\n' +
'if (!defined(\'MKARR_CLOSE\')) {\n' +
'  define(\'MKARR_OPEN\', 1 >> 1);\n' +
'}\n' +
'if (!function_exists(\'mkArr\')) {\n' +
'  function mkArr($start, $end, $flag) {\n' +
'    $arr = [];\n' +
'    if ($flag & MKARR_OPEN) {\n' +
'      if ($start <= $end) {\n' +
'        for ($i = $start; $i < $end; $i++) {\n' +
'          $arr[] = $i;\n' +
'        }\n' +
'      } else {\n' +
'        for ($i = $start; $i > $end; $i--) {\n' +
'          $arr[] = $i;\n' +
'        }\n' +
'      }\n' +
'    } elseif ($flag & MKARR_CLOSE) {\n' +
'      if ($start <= $end) {\n' +
'        for ($i = $start; $i <= $end; $i++) {\n' +
'          $arr[] = $i;\n' +
'        }\n' +
'      } else {\n' +
'        for ($i = $start; $i >= $end; $i--) {\n' +
'          $arr[] = $i;\n' +
'        }\n' +
'      }\n' +
'    }\n' +
'    return $arr;\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'str_pos\')) {\n' +
'  function str_pos($str, $substr) {\n' +
'    $res = strpos($str, $substr);\n' +
'    return ($res === false ? -1 : $res);\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'str_upfirst\')) {\n' +
'  function str_upfirst($str) {\n' +
'    $res = explode(\' \', preg_replace(\'/[\\s\\n\\t]+/\', \' \', $str));\n' +
'    foreach ($res as $index => $word) {\n' +
'      $res[$index] = mb_strtoupper(mb_substr($word, 0, 1, \'UTF-8\'), \'UTF-8\') . mb_strtolower(mb_substr($word, 1, NULL, \'UTF-8\'), \'UTF-8\');\n' +
'    }\n' +
'    return implode(\' \', $res);\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'str_camel\')) {\n' +
'  function str_camel($str) {\n' +
'    $res = explode(\' \', preg_replace(\'/[\\s\\n\\t]+/\', \' \', $str));\n' +
'    foreach ($res as $index => $word) {\n' +
'      if (!$index) continue;\n' +
'      $res[$index] = mb_strtoupper(mb_substr($word, 0, 1, \'UTF-8\'), \'UTF-8\') . mb_strtolower(mb_substr($word, 1, NULL, \'UTF-8\'), \'UTF-8\');\n' +
'    }\n' +
'    return implode(\'\', $res);\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'str_kebab\')) {\n' +
'  function str_kebab($str) {\n' +
'    $res = explode(\' \', preg_replace(\'/[\\s\\n\\t]+/\', \' \', $str));\n' +
'    foreach ($res as $index => $word) {\n' +
'      $res[$index] = mb_strtolower($word, \'UTF-8\');\n' +
'    }\n' +
'    return implode(\'-\', $res);\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'arr_push\')) {\n' +
'  function arr_push(& $arr, $value) {\n' +
'    array_push($arr, $value);\n' +
'    return \'\';\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'arr_unshift\')) {\n' +
'  function arr_unshift(& $arr, $value) {\n' +
'    array_unshift($arr, $value);\n' +
'    return \'\';\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'arr_rand\')) {\n' +
'  function arr_rand($arr) {\n' +
'    $keys = array_keys($arr);\n' +
'    return $arr[$keys[rand(0, count($keys) - 1)]];\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'arr_sort\')) {\n' +
'  function arr_sort($arr) {\n' +
'    $sorted = $arr;\n' +
'    sort($sorted);\n' +
'    return $sorted;\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'arr_sort_reverse\')) {\n' +
'  function arr_sort_reverse($arr) {\n' +
'    $sorted = $arr;\n' +
'    rsort($sorted);\n' +
'    return $sorted;\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'arr_keysort\')) {\n' +
'  function arr_keysort($arr) {\n' +
'    $sorted = $arr;\n' +
'    ksort($sorted);\n' +
'    return $sorted;\n' +
'  }\n' +
'}\n' +
'if (!function_exists(\'arr_keysort_reverse\')) {\n' +
'  function arr_keysort_reverse($arr) {\n' +
'    $sorted = $arr;\n' +
'    krsort($sorted);\n' +
'    return $sorted;\n' +
'  }\n' +
'}\n' +
'return function ($_data = [], $_childsTemplate = false) {\n' +
'  foreach ($_data as $_key => $_value) {\n' +
'    $$_key = $_value;\n' +
'  }\n' +
'  ob_start();\n' +
'// >>> GENERATED CODE\n' +
'?>\n'
var postfix = '<?php\n' +
'// <<< GENERATED CODE\n' +
'  $content = ob_get_contents();\n' +
'  ob_end_clean();\n' +
'  return $content;\n' +
'};'
var variableIncrement = 0

function getVariableIncrement () {
  return variableIncrement++
}

function handleParams (params) {
  return params.map(function (attr) {
    return expression(attr)
  })
}

function handleFunction (tree) {
  var funcName
  var params

  funcName =
    (tree.value.type === 'var' && !tree.value.keys.length ? tree.value.value : expression(tree.value))

  switch (funcName) {
    case 'str_sub':
      params = handleParams(tree.attrs)

      if (params.length < 3) {
        params.push('NULL')
      }

      return 'mb_substr' + '(' + params.join(', ') + ', \'UTF-8\')'

    case 'str_len':
      return 'mb_strlen(' + handleParams(tree.attrs).join(', ') + ', \'UTF-8\')'

    case 'str_replace':
      params = handleParams(tree.attrs)

      return 'str_replace(' + params[1] + ', ' + params[2] + ', ' + params[0] + ')'
    case 'str_pad':
      params = handleParams(tree.attrs)

      if (!params[3]) {
        params[3] = 'STR_PAD_RIGHT'
      }

      params[3] = params[3].replace('$STRPADLEFT', 'STR_PAD_LEFT')
      params[3] = params[3].replace('$STRPADRIGHT', 'STR_PAD_RIGHT')
      params[3] = params[3].replace('$STRPADBOTH', 'STR_PAD_BOTH')

      return 'str_pad(' + params.join(', ') + ')'

    case 'str_split':
      params = handleParams(tree.attrs)

      if (params[1] === '""') {
        return 'str_split(' + params[0] + ')'
      }

      return 'explode(' + params[1] + ', ' + params[0] + ')'
    case 'str_lower':
      return 'mb_strtolower(' + handleParams(tree.attrs).join(', ') + ', \'UTF-8\')'
    case 'str_upper':
      return 'mb_strtoupper(' + handleParams(tree.attrs).join(', ') + ', \'UTF-8\')'
    case 'str_trim':
      return 'trim(' + handleParams(tree.attrs).join(', ') + ')'
    case 'str_ltrim':
      return 'ltrim(' + handleParams(tree.attrs).join(', ') + ')'
    case 'str_rtrim':
      return 'rtrim(' + handleParams(tree.attrs).join(', ') + ')'
    case 'str_urlencode':
      return 'rawurlencode(' + handleParams(tree.attrs).join(', ') + ')'
    case 'str_urldecode':
      return 'rawurldecode(' + handleParams(tree.attrs).join(', ') + ')'
    case 'str_htmlescape':
      return 'htmlspecialchars(' + handleParams(tree.attrs).join(', ') + ')'

    case 'arr_keys':
      return 'array_keys(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_contain':
      params = handleParams(tree.attrs)

      return '(array_search(' + params[1] + ', ' + params[0] + ') !== false)'
    case 'arr_values':
      return 'array_values(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_len':
      return 'count(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_pop':
      return 'array_pop(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_shift':
      return 'array_shift(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_slice':
      return 'array_slice(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_splice':
      return 'array_splice(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_pad':
      return 'array_pad(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_reverse':
      return 'array_reverse(' + handleParams(tree.attrs).join(', ') + ')'
    case 'arr_unique':
      return 'array_unique(' + handleParams(tree.attrs).join(', ') + ')'
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
    str.push(key + ' => ' + result[key])
  }

  return '[' + str.join(', ') + ']'
}

function expression (tree) {
  var str = ''

  if (typeof tree === 'string') return tree

  switch (tree.type) {
    case 'var':
      if (tree.value === 'childs') {
        tree.value = '_childsTemplate'
      }

      str += (~consts.indexOf(tree.value) ? '' : '$') + tree.value + tree.keys.map(function (key) {
        return '[' + expression(key) + ']'
      }).join('')

      return str
    case 'num':
      str += tree.value

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
      }).join(' . ')

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

function switchNode (node) {
  var result = ''
  var randomVar
  var params

  switch (node.type) {
    case 'tag':
      result += '<' + node.value + reduce(node.attrs.childs) + '>'
      result += reduce(node.childs)
      result += '</' + node.value + '>'

      return result
    case 'single_tag':
      result += '<' + node.value + reduce(node.attrs.childs) + (node.value === '!DOCTYPE' ? '' : ' /') + '>'

      return result
    case 'comment':
      result += '<!--' + node.value + '-->'

      return result
    case 'assign':
      result += '<?php ' + expression(node.value) + ' = ' + expression(node.expr) + '; ?>'

      return result
    case 'if':
      result += '<?php if (' + expression(node.value) + ') { ?>'
      result += reduce(node.childs)

      return result
    case 'elseif':
      result += '<?php } elseif (' + expression(node.value) + ') { ?>'
      result += reduce(node.childs)

      return result
    case 'else':
      result += '<?php } else { ?>'
      result += reduce(node.childs)

      return result
    case 'endif':
      result += '<?php } ?>'

      return result
    case 'for':
      result += '<?php foreach ('

      if (node.value.length === 2) {
        result += expression(node.value[1]) + ' as ' + expression(node.value[0])
      } else if (node.value.length === 3) {
        result += expression(node.value[2]) + ' as ' + expression(node.value[0]) +
          ' => ' + expression(node.value[1])
      }

      result += ') { ?>'
      result += reduce(node.childs)

      result += '<?php } ?>'

      return result
    case 'expr':
      if (node.value.type === 'isset') {
        result += '<?php if (isset(' + expression(node.value.value) + ')) echo ' + expression(node.value.value) + '; ?>'
      } else {
        result += '<?php echo ' + expression(node.value) + '; ?>'
      }

      return result
    case 'text':
      result += node.value

      return result
    case 'param':
      if (node.value) {
        if (node.value.childs.length) {
          result += reduce(node.value.childs)
        }

        return ' ' + node.name + (result.length ? '="' + result + '"' : '')
      }

      if (node.string) {
        if (node.string.childs.length) {
          result += reduce(node.string.childs)
        }

        return ' ' + (result.length ? '"' + result + '"' : '')
      }

      return ''
    case 'include':
      randomVar = '$childs' + getVariableIncrement()

      result += '<?php $_' + node.variable + ' = include \'' + node.path + '.php\'; ?>'
      result += '<?php ob_start(); ?>'
      result += reduce(node.childs)
      result += '<?php\n'
      result += randomVar + ' = ob_get_contents(); ob_end_clean(); '

      params = node.params.childs.map(function (param) {
        if (param.value.childs && param.value.childs[0].type === 'expr') {
          return '\'' + param.name + '\' => ' + expression(param.value.childs[0].value);
        }

        return '\'' + param.name + '\' => \"' + reduce(param.value.childs || param.value) + '\"'
      })

      result += 'echo $_' + node.variable + '([' + params.join(',\n') + '], ' + randomVar + '); ?>'

      return result
  }

  return ''
}

function reduce (tree) {
  var result = ''

  tree.forEach(function (node) {
    result += switchNode(node)
  })

  return result
}

module.exports = {
  ext: 'php',
  stringify: function (tree) {
    variableIncrement = 0

    return prefix + reduce(tree.childs) + postfix
  }
}
