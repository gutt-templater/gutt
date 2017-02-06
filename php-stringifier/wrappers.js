module.exports = {
  prefix:
    '<?php\n' +
    'if (!defined(\'MKARR_OPEN\')) {\n' +
    '  define(\'MKARR_OPEN\', 2 << 1);\n' +
    '}\n' +
    'if (!defined(\'MKARR_CLOSE\')) {\n' +
    '  define(\'MKARR_CLOSE\', 1 << 1);\n' +
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
    '$__components = [];\n' +
    'return function ($__data = [], $__children = false) {\n' +
    '  foreach ($__data as $__key => $__value) {\n' +
    '    $$__key = $__value;\n' +
    '  }\n' +
    '  ob_start();\n' +
    '// >>> GENERATED CODE\n' +
    '?>\n',
  postfix: '<?php\n' +
    '// <<< GENERATED CODE\n' +
    '  $content = ob_get_contents();\n' +
    '  ob_end_clean();\n' +
    '  return $content;\n' +
    '};'
}
