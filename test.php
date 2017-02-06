<?php
$a = 4;
$b = 3;
$uid = 'u123';
$name = 'alyoshka';
$userid = '456';
?>

<?php
if (!defined('MKARR_OPEN')) {
  define('MKARR_OPEN', 2 << 1);
}
if (!defined('MKARR_CLOSE')) {
  define('MKARR_CLOSE', 1 << 1);
}
if (!function_exists('mkArr')) {
  function mkArr($start, $end, $flag) {
    $arr = [];
    if ($flag & MKARR_OPEN) {
      if ($start <= $end) {
        for ($i = $start; $i < $end; $i++) {
          $arr[] = $i;
        }
      } else {
        for ($i = $start; $i > $end; $i--) {
          $arr[] = $i;
        }
      }
    } elseif ($flag & MKARR_CLOSE) {
      if ($start <= $end) {
        for ($i = $start; $i <= $end; $i++) {
          $arr[] = $i;
        }
      } else {
        for ($i = $start; $i >= $end; $i--) {
          $arr[] = $i;
        }
      }
    }
    return $arr;
  }
}
?><?php $attrs9 = [];?><?php $attrs9["selected"] = false;?>
<?php $attrs9["data-role"] = "lalala";?>
<?php $attrs9[$name] = $name;?>
<?php foreach (mkArr(1, 6, MKARR_CLOSE) as $index => $number) { ?>
<?php if ($index / 2 == 1) { ?>
 <?php $attrs9["data-index" . $index] = $number * 2;?>
<?php } ?>
<?php } ?>
 <?php $attrs9[$uid] = $userid;?>

<div <?php foreach($attrs9 as $key9 => $value9)
 echo " " . $key9 . ($value9 ? "=\"" . $value9 . "\"" : ""); ?>
>  <?php foreach (mkArr(1, 6, MKARR_CLOSE) as $index => $number) { ?>
    <?php if ($index / 2 == 0) { ?>
          <?php } ?>
<?php } ?>
  <?php if ($a > $b) { ?>
    <?php $attrs15 = [];?> <?php $attrs15["type"] = "text";?>

<input <?php foreach($attrs15 as $key15 => $value15)
 echo " " . $key15 . ($value15 ? "=\"" . $value15 . "\"" : ""); ?>
 /><?php } ?>
</div>
