<?php
return function ($_data, $_childsTemplate = false) {
  foreach ($_data as $_key => $_value) {
    $$_key = $_value;
  }
  ob_start();
// >>> GENERATED CODE
?>
<!-- some text 12345 _ # $ % ! - -- = [ ] \{ \} + ; : ( ) " ' \ / ~ _#$%!--=+;:()"'\/~ qwe123:-_ --><?php
// <<< GENERATED CODE
  $content = ob_get_contents();
  ob_end_clean();
  return $content;
};
