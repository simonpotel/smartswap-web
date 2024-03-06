<?php

// this file is used to fetch the data because php make the request in local (from SERVER to SERVER)
// while using the fetch in JS directly its make the request from USER to SERVER, since the API is in LOCAL, it was not working.

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$request = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$currency = $request[count($request) - 1];

$url = "http://127.0.0.1:5000/monthly_analyze/{$currency}";
$data = file_get_contents($url);
$data = json_decode($data, true);
echo json_encode($data);
