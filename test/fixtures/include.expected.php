<?php echo import($FormItem, "./includes/form-item"); ?>

<form action="/cms/configs/<?php if (isset($id)) { ?><?php echo $alias; ?><?php } else { ?>add<?php } ?>/" class="form" role="configs-add-form">
  <?php echo include("./includes/form-head"); ?><?php echo $endinclude; ?>

  <div class="form__holder">
  
    <label for></label>
    <input type="text" class="form__inp" value="<?php echo $title; ?>" name="name" id="name" role="configs-add-title" />
  
</div>
  <div class="form__holder">
  
    <label for></label>
    <input type="text" class="form__inp" value="<?php echo $title; ?>" name="name" id="name" role="configs-add-title" />
  
</div>

  <div>
  <?php echo include("./includes/form-group", $fields); ?>
    <div class="form__holder">
  
    <label for></label>
    <input type="text" class="form__inp" value="<?php echo $title; ?>" name="name" id="name" role="configs-add-title" />
  
</div>
  <?php echo $endinclude; ?>
  </div>
</form>
