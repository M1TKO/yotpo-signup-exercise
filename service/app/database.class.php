<?php

class Database {

  private $host, $database, $username, $password, $connection;

  function __construct($host = DB_HOST, $username = DB_USERNAME, $password = DB_PASSWORD, $database = DB_NAME) {
    $this->host = $host;
    $this->database = $database;
    $this->username = $username;
    $this->password = $password;
    $this->open();
  }

  function open() {
    $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
  }

  function close() {
    $this->connection->close();
  }

  function execute($query) {
    $result = $this->connection->query($query);
    return $result;
  }

  function select($query) {
    $result = $this->connection->query($query);
    if (!$result) {
      return [];
    }
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    return $data;
  }

  function selectOne($query) {
    $data = $this->select($query);
    return $data[0] ?? [];
  }

  function escape($string) {
    return $this->connection->real_escape_string($string);
  }
}
