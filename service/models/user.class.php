<?php

abstract class UserModel {

	static function getUserByEmail($email) {
		$db = new Database();
		$email = $db->escape($email);
		$result = $db->select("SELECT * FROM users WHERE email = '$email'");
		$db->close();
		return $result;
	}

	static function createNewUser($email, $password, $phone) {
		$db = new Database();
		$email = $db->escape($email);
		$phone = $db->escape($phone);
		$password = $db->escape($password);
		$passwordHashed = password_hash($password,  PASSWORD_BCRYPT);
		$result = $db->execute("INSERT INTO users (`email`, `password`, `phone`) VALUES ('$email', '$passwordHashed', '$phone')");
		if (!empty($result)) {
			$result = $db->selectOne("SELECT `id`, `email`, `phone`, `created` FROM users ORDER BY id DESC LIMIT 1");
		}
		$db->close();
		return $result;
	}
}