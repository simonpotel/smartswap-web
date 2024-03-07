<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    /*
    $input_username = $_POST["username"];
    $input_password = $_POST["password"];

    $config_json = file_get_contents('../db_config.json');
    $config_array = json_decode($config_json, true);

    if ($config_array === null) { 
        header("Location: ../etc/errorPage.html"); // Error reading json
        exit();
    }

    $servername = $config_array['host'];
    $db_username = $config_array['user'];
    $db_password = $config_array['pass'];
    $dbname = $config_array['database'];
    $conn = new mysqli($servername, $db_username, $db_password, $dbname);

    if ($conn->connect_error) {
        header("Location: ../etc/errorPage.html");
        exit();
    }

    $sql = "SELECT * FROM smartswap.clients WHERE user = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        header("Location: ../etc/errorPage.html"); // Connection to database failed 
        exit();
    }
    
    $stmt->bind_param('ss', $input_username, $input_password);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        header("Location: ../etc/testPage.html");
        exit();
    } else {
        header("Location: ../etc/errorPage.html"); // Connection refused 
        exit();
    }
*/
header("Location: ../../html/pages/error.html");
exit();
} else {

    header("Location: index.html");
    exit();
}
?>
