<?php
return function ($_data, $_childsTemplate = false) {
  foreach ($_data as $_key => $_value) {
    $$_key = $_value;
  }
  ob_start();
// >>> GENERATED CODE
?>
<?php echo $b + $c[$d]["str"][foo($bar, $zoo[2])] * 2 / (func() - $Math["calc"](1, 2)) * -1 && $def && 3 & 1; ?><?php
// <<< GENERATED CODE
  $content = ob_get_contents();
  ob_end_clean();
  return $content;
};
