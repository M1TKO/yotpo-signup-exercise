<?php

abstract class GeneralHelper {

	static function validateSignUpData($data) {
		if (!filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
			return false;
		}
		$password = strval($data['password'] ?? '');
		if (strlen($password) < 6) {
			return false;
		}
		// * Only BG numbers are supported
		$phone = strval($data['phone'] ?? '');
		if (strlen($phone) !== 12 || strpos($phone, '359') !== 0) {
			return false;
		}
		return true;
	}

	static function getNewOTP() {
		return rand(1000, 9999);
	}
}