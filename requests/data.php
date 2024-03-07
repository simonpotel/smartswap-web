<?php
$config_json = file_get_contents(__DIR__ . '/../db_config.json');
$config_array = json_decode($config_json, true);

if ($config_array === null) {
    die("Error reading JSON configuration file.");
}

$servername = $config_array['host'];
$username = $config_array['user'];
$password = $config_array['pass'];
$dbname = $config_array['database'];
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SHOW TABLES";
$result = $conn->query($sql);

$tables = array();
while ($row = $result->fetch_row()) {
    $tables[] = $row[0];
}

$data = array();
foreach ($tables as $tableName) {
    $tableData = array();

    $query = "SELECT * FROM $tableName";
    $tableResult = $conn->query($query);

    while ($row = $tableResult->fetch_assoc()) {
        $tableData[] = $row;
    }

    $data[$tableName] = $tableData;
}

$conn->close();

header('Content-Type: application/json');
echo json_encode(array('tables' => $tables, 'data' => $data));
exit;
?>
