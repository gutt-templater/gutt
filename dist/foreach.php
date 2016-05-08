<?php foreach ($news as $index => $item) { ?>
  <h1>
    <?php echo $item["title"]; ?>
  </h1>
<?php } ?>
<?php foreach ($news as $item) { ?>
  <h2>
    <?php echo $item["subtitle"]; ?>
  </h2>
<?php } ?>
