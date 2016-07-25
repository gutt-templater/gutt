<?php
return function ($_data, $_childsTemplate = false) {
  foreach ($_data as $_key => $_value) {
    $$_key = $_value;
  }
  ob_start();
// >>> GENERATED CODE
?>




<?php $_Aside = include '/Users/makingoff/Projects/html-parser/test/fixtures/include/aside.php'; ?><?php ob_start(); ?>

  <form>
    <?php $_Section = include '/Users/makingoff/Projects/html-parser/test/fixtures/include/section.php'; ?><?php ob_start(); ?>

      <table></table>
      <span>
        <?php $_Section = include '/Users/makingoff/Projects/html-parser/test/fixtures/include/section.php'; ?><?php ob_start(); ?>

          <label for="label1">Лейбл1</label>
          <hr />
        
<?php
$childs4 = ob_get_contents(); ob_end_clean(); echo $_Section([], $childs4); ?>

        <dt><?php $_Footer = include '/Users/makingoff/Projects/html-parser/test/fixtures/include/footer.php'; ?><?php ob_start(); ?>
Just text
<?php
$childs6 = ob_get_contents(); ob_end_clean(); echo $_Footer([], $childs6); ?></dt>
      </span>
    
<?php
$childs2 = ob_get_contents(); ob_end_clean(); echo $_Section([], $childs2); ?>
  </form>

<?php
$childs0 = ob_get_contents(); ob_end_clean(); echo $_Aside([], $childs0); ?><?php
// <<< GENERATED CODE
  $content = ob_get_contents();
  ob_end_clean();
  return $content;
};
