<?php
session_start();

include dirname(__FILE__) . DIRECTORY_SEPARATOR . 'config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

# Remove extension
$url = empty($_GET['url']) ? '' : $_GET['url'];
$url = strtolower(substr($url, strpos($url, '.')));
$urlParts = explode('/', $url);
$response = null;

if (count($urlParts) === 2) {
	$className = ucfirst($urlParts[0]);
	$classMethod = str_replace('-', '_', $urlParts[1]);
	if (method_exists($className, $classMethod)) {
		$response = call_user_func([$className, $classMethod]);
	} else {
		$response = ['error' => 'Action not supported'];
	}
} else {
	$response = ['error' => 'Invalid parameters'];
}

exit(json_encode($response));