<?php
return function ($_data = [], $_childsTemplate = false) {
  foreach ($_data as $_key => $_value) {
    $$_key = $_value;
  }
  ob_start();
// >>> GENERATED CODE
?>



<?php $value = "Hello"; ?>

<section>
  <?php $_Wrapper = include '/Users/makingoff/Projects/html-parser/test/fixtures/wrapper.php'; ?><?php ob_start(); ?>

    <?php $_Wrapper2 = include '/Users/makingoff/Projects/html-parser/test/fixtures/wrapper2.php'; ?><?php ob_start(); ?>

      <?php $value = $value . ", Alex"; ?>
      <input type="text" value="<?php echo $value; ?>" />
    
<?php
$childs1 = ob_get_contents(); ob_end_clean(); echo $_Wrapper2([], $childs1); ?>
  
<?php
$childs0 = ob_get_contents(); ob_end_clean(); echo $_Wrapper(['title' => "Super form"], $childs0); ?>
</section>
<h1><?php echo $value; ?></h1><?php
// <<< GENERATED CODE
  $content = ob_get_contents();
  ob_end_clean();
  return $content;
};