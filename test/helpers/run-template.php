<?php

$templateName = $argv[1];
$jsonParams = $argv[2];

if (empty($jsonParams)) {
  $jsonParams = '{}';
}

$template = include(__DIR__ . '/../../tmp/' . $templateName . '.php');

echo $template(json_decode($jsonParams, true));
