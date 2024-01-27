<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = $_POST["username"];
    $password = $_POST["password"];

    // To be modified using database
    $allowedUsernames = ["smartswap"];
    $allowedPasswords = ["smartswap"];

    if (in_array($username, $allowedUsernames) && in_array($password, $allowedPasswords)) {
        echo "Identification ok";
    } else {
        header("Location: ../etc/errorPage.html");
        exit();
    }
} else {

    header("Location: index.html");
    exit();
}
?>