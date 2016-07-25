<?php
return function ($_data, $_childsTemplate = false) {
  foreach ($_data as $_key => $_value) {
    $$_key = $_value;
  }
  ob_start();
// >>> GENERATED CODE
?>
<?php foreach ($fields as $field) { ?>
  <?php if (!isset($field["settings"]["hide"]) || (isset($field["settings"]["hide"]) && !$field["settings"]["hide"])) { ?>
<div class="form__item">
  <label for="<?php echo $field["alias"]; ?>" class="form__label"><?php echo $field["title"]; ?></label>
  <div class="form__inp-contain" role="input-contain">
  <?php echo include("types/*(&)^1#$%^.,[]\{\}-+=" . $field["type"] . "/item"); ?>
  </div>
</div>
  <?php } ?>
<?php } ?>
<div class="form__submit">
  <button class="form__btn form__btn--submit">Создать</button>
  <a href="/cms/<?php if (isset($section)) echo $section; ?>/" class="form__btn">Отменить</a>
</div><?php
// <<< GENERATED CODE
  $content = ob_get_contents();
  ob_end_clean();
  return $content;
};
