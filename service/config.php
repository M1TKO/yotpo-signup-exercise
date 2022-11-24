<?php

defined('DS') OR define('DS', DIRECTORY_SEPARATOR);

define('DB_NAME', 'yotpo_exercise');
define('DB_HOST', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_PORT', null);

error_reporting(-1);

include(dirname(__FILE__) . DS . 'autoload.php');
