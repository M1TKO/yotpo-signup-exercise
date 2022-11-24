<?php

abstract class Api {

	static function signup($resend = false) {
		try {
			$data = file_get_contents('php://input');
			$data = json_decode($data, true);
			if (!GeneralHelper::validateSignUpData($data)) {
				throw new Exception('User valiation error');
			}

			if (!empty(UserModel::getUserByEmail($data['email']))) {
				throw new Exception('User already exists');
			}

			$oneTimePassword = GeneralHelper::getNewOTP();
			OTPModel::generateNewUserOTP($data['email'], $data['phone'], $oneTimePassword);

			# Send SMS to the phone number (DB mock)
			OTPModel::sendMockSMS(
				$data['phone'],
				'Confirm phone number with OTP',
				"Your code is: $oneTimePassword",
			);

			OTPModel::logVerificaionAttempt(
				$data['email'],
				$data['phone'],
				$resend ? 'Resend sign up OTP' : 'Init sign up OTP',
			);

			return [
				'status' => 'SUCCESS',
				'message' => 'OTP generated and sent to the phone number'
			];
		} catch (Exception $error) {
			return [
				'status' => 'ERROR',
				'message' => $error->getMessage()
			];
		}
	}

	static function signup_validate_otp() {
		try {
			$data = file_get_contents('php://input');
			$data = json_decode($data, true);
			if (!GeneralHelper::validateSignUpData($data)) {
				throw new Exception('User valiation error');
			}

			if (!empty(UserModel::getUserByEmail($data['email']))) {
				throw new Exception('User already exists');
			}

			$success = OTPModel::verifyOTP($data['email'], $data['phone'], $data['otp']);
			if ($success) {
				$userData = UserModel::createNewUser($data['email'], $data['password'], $data['phone']);
				OTPModel::logVerificaionAttempt(
					$data['email'],
					$data['phone'],
					"OTP verified successfully. User created.",
				);
				# Send greetings SMS (DB mock)
				OTPModel::sendMockSMS(
					$data['phone'],
					'Yotpo',
					"Welcome to SMSBump!",
				);
				return [
					'status' => 'SUCCESS',
					'message' => 'OTP generated and sent to the phone number',
					'userData' => $userData
				];
			} else {
				OTPModel::logVerificaionAttempt(
					$data['email'],
					$data['phone'],
					"OTP failed verfication try",
				);
				throw new Exception('OTP not valid');
			}

		} catch (Exception $error) {
			return [
				'status' => 'ERROR',
				'message' => $error->getMessage()
			];
		}
	}

	static function signup_resend_otp() {
		return self::signup(true);
	}
}