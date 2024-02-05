<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = $_POST["username"];
    $password = $_POST["password"];

    $config_json = file_get_contents('../db_config.json');
    $config_array = json_decode($config_json, true);

    if ($config_array === null) {
        header("Location: ../etc/errorPage.html"); /* Error reading json */
        exit();
    }

    $servername = $config_array['host'];
    $username = $config_array['user'];
    $password = $config_array['pass'];
    $dbname = $config_array['database'];
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        header("Location: ../etc/errorPage.html"); /* Connection to database failed */
        exit();
    }

    $sql = "select * from smartswap where username=:username and password=:password";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $password);
	$stmt->execute();
	$res= $stmt->fetchAll();
    

    if (count($res) > 0) {
        echo "Identification ok";
    } else {
        header("Location: ../etc/errorPage.html"); /* Connection refused */
        exit();
    }
} else {

    header("Location: index.html");
    exit();
}
?>