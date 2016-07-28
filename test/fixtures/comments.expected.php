<?php
return function ($_data = [], $_childsTemplate = false) {
  foreach ($_data as $_key => $_value) {
    $$_key = $_value;
  }
  ob_start();
// >>> GENERATED CODE
?>


<?php foreach ($comments as $index => $comment) { ?>
<div class="comment" data-index="<?php echo $index; ?>">
  <div class="name"><?php echo $comment["name"]; ?>, <span class="date"><?php echo $comment["date"]; ?></span></div>
  <div class="message"><?php echo $comment["message"]; ?></div>
  <div class="childs">
    <?php $_Comments = include '/Users/makingoff/Projects/html-parser/test/fixtures/comments.php'; ?><?php ob_start(); ?>

<?php
$childs0 = ob_get_contents(); ob_end_clean(); echo $_Comments(['comments' => $comment["childs"]], $childs0); ?>
  </div>
</div>
<?php } ?><?php
// <<< GENERATED CODE
  $content = ob_get_contents();
  ob_end_clean();
  return $content;
};
