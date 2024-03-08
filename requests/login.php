<?php

$db_config = json_decode(file_get_contents('../db_config.json'), true);

$host = $db_config['host'];
$user = $db_config['user'];
$pass = $db_config['pass'];
$database = $db_config['database'];

// connect to the db
$conn = new mysqli($host, $user, $pass, "smartswap");

// check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// get login / password | from the request
$login = $_POST['login'];
$password = $_POST['password'];

// make the request to the database
$sql = "SELECT * FROM smartswap.clients WHERE user = '$login' AND password = '$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}

$conn->close();

