<?php
return function ($_data = [], $_childsTemplate = false) {
  foreach ($_data as $_key => $_value) {
    $$_key = $_value;
  }
  ob_start();
// >>> GENERATED CODE
?>
<?php if ($a == $b) { ?>
  <?php $a = $b + $c; ?>
<?php } elseif ($g > 2 && $u < 8 || $g >= 10 && $u <= 12 || false) { ?>
  <?php $e = true; ?>
<?php } elseif ($c != $d) { ?>
  <?php $e = $f * $d; ?>
<?php } else { ?>
  <?php echo $i - $g; ?>
<?php } ?><?php
// <<< GENERATED CODE
  $content = ob_get_contents();
  ob_end_clean();
  return $content;
};
