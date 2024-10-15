<?php
// Database connection
$servername = "localhost";
$username = "your_db_username";
$password = "your_db_password";
$dbname = "your_db_name";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["register_btn"])) {
    $user = mysqli_real_escape_string($conn, $_POST["user2"]);
    $email = mysqli_real_escape_string($conn, $_POST["email2"]);
    $password = mysqli_real_escape_string($conn, $_POST["pass2"]);

    // Basic validation
    if (!empty($user) && !empty($email) && !empty($password)) {
        // Hash the password for security
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Insert user into the database
        $sql = "INSERT INTO users (username, email, password) VALUES ('$user', '$email', '$hashed_password')";
        if ($conn->query($sql) === TRUE) {
            echo "Registration successful!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Please fill in all fields.";
    }
}

// Close connection
$conn->close();
?>
