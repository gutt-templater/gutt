<?php
return function ($_data = [], $_childsTemplate = false) {
  foreach ($_data as $_key => $_value) {
    $$_key = $_value;
  }
  ob_start();
// >>> GENERATED CODE
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Document</title>
</head>
<body>
  <div class="advices">
    <h1 class="head"></h1>

    <div class="tiles">
      <div class="tiles">
        <?php foreach ($tiles as $tile) { ?>
        <div class="tiles__tile<?php if ($tile["active"]) { ?> tile--active<?php } ?>"><?php echo $tile["name"]; ?></div>
        <?php } ?>
      </div>
    </div>

    <div class="footer">
      <div class="footer">
        <span class="copy<?php if ($a > $b) { ?> active<?php } ?>"></span>
        <span class="phone"></span>
        <span class="email"></span>
      </div>
    </div>
  </div>
</body>
</html><?php
// <<< GENERATED CODE
  $content = ob_get_contents();
  ob_end_clean();
  return $content;
};
