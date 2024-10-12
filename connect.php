<?php
    $host = "localhost";
    $username = "localhost";
    $password = "";
    $database = "users";

    // Create DB Connection
    $conn = mysqli_connect($host, $username, $password, $database);

    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
?>