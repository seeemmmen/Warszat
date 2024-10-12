<?php
// Database connection
$servername = "localhost";  // Your server
$username = "root";         // Your MySQL username
$password = "";             // Your MySQL password
$dbname = "workshop_users"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);



// Проверяем соединение
if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
} else {
    echo "Соединение установлено успешно";
}

if (isset($_POST['register_btn'])) {
    $user = mysqli_real_escape_string($conn, $_POST['user2']);
    $email = mysqli_real_escape_string($conn, $_POST['email2']);
    $pass = mysqli_real_escape_string($conn, $_POST['pass2']);

    // Check if the username or email already exists
    $checkQuery = "SELECT * FROM users WHERE username='$user' OR email='$email' LIMIT 1";
    $result = mysqli_query($conn, $checkQuery);
    $userExists = mysqli_fetch_assoc($result);

    if ($userExists) { 
        if ($userExists['username'] === $user) {
            echo "Username already exists.";
        }

        if ($userExists['email'] === $email) {
            echo "Email already exists.";
        }
    } else {
        // Hash password before storing
        $hashed_password = password_hash($pass, PASSWORD_DEFAULT);

        // Insert user into the database
        $query = "INSERT INTO users (username, email, password) 
                  VALUES('$user', '$email', '$hashed_password')";
        echo "Пользователь: $user, Email: $email, Пароль: $hashed_pass";
          

        if (mysqli_query($conn, $query)) {
            echo "Registration successful! <a href='login.html'>Login here</a>";
        } else {
            echo "Error: " . $query . "<br>" . mysqli_error($conn);
        }
    }
}

$conn->close();
?>
