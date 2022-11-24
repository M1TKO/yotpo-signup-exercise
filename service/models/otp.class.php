<?php

abstract class OTPModel {

	static function generateNewUserOTP($email, $phone, $token) {
		$db = new Database();
		$email = $db->escape($email);
		$phone = $db->escape($phone);
		$token = $db->escape($token);
		$result = $db->execute("INSERT INTO `signup_otp` (`token`, `email`, `phone`) VALUES ('$token', '$email', '$phone')");
		$db->close();
		return $result;
	}

	static function sendMockSMS($phone, $title, $message) {
		$db = new Database();
		$phone = $db->escape($phone);
		$title = $db->escape($title);
		$message = $db->escape($message);
		$result = $db->execute("INSERT INTO `sms_provider_mock` (`phone`, `title`, `message`) VALUES ('$phone', '$title', '$message')");
		$db->close();
		return $result;
	}

	static function logVerificaionAttempt($email, $phone, $action) {
		$db = new Database();
		$email = $db->escape($email);
		$phone = $db->escape($phone);
		$action = $db->escape($action);
		$result = $db->execute("INSERT INTO `signup_otp_verification_attempts` (`email`, `phone`, `action`) VALUES ('$email', '$phone', '$action')");
		$db->close();
		return $result;
	}

	static function verifyOTP($email, $phone, $token) {
		$db = new Database();
		$email = $db->escape($email);
		$phone = $db->escape($phone);
		$token = $db->escape($token);
		$result = $db->selectOne(
			"SELECT token FROM signup_otp
			WHERE `email` = '$email' AND `phone` = '$phone'
			ORDER BY `id` DESC
			LIMIT 1"
		);
		$db->close();

		return $result['token'] == $token;
	}

}