<?php

// this file is used to fetch the data because php make the request in local (from SERVER to SERVER)
// while using the fetch in JS directly its make the request from USER to SERVER, since the API is in LOCAL, it was not working.

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// get currency from the url
$request = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$currency = $request[count($request) - 1];

// get response
$response = [
    'currency' => $currency,
    'data' => [ /* data here */ ],
];

// send back json
echo json_encode($response);

