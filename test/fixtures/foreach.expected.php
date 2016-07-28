<?php
return function ($_data = [], $_childsTemplate = false) {
  foreach ($_data as $_key => $_value) {
    $$_key = $_value;
  }
  ob_start();
// >>> GENERATED CODE
?>
<?php foreach ($news as $index => $item) { ?>
  <h1><?php echo $item["title"]; ?></h1>
<?php } ?>
<?php foreach ($news as $item) { ?>
  <h2><?php echo $item["subtitle"]; ?></h2>
<?php } ?><?php
// <<< GENERATED CODE
  $content = ob_get_contents();
  ob_end_clean();
  return $content;
};
