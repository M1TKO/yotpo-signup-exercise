<?php

# Define autoloader
function autoload($className) {
	$className = str_replace('model', '', strtolower($className));
	$modelFile = dirname(__FILE__) . DS . 'models' . DS . $className . '.class.php';
	if (file_exists($modelFile)) {
		include $modelFile;
	}

	$className = str_replace('helper', '', strtolower($className));
	$helperFile = dirname(__FILE__) . DS . 'helpers' . DS . $className . '.helper.php';
	if (file_exists($helperFile)) {
		include $helperFile;
	}

	$classFile = dirname(__FILE__) . DS . 'app' . DS . $className . '.class.php';
	if (file_exists($classFile)) {
		include $classFile;
	}
}
spl_autoload_register('autoload');
