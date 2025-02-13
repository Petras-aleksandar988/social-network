<?php
include 'db.php';

$data = null;
$method = $_SERVER['REQUEST_METHOD'];
// Fetch request body based on request method
if ($method === 'POST' || $method === 'PUT') {
    // For POST and PUT requests, get the raw input
    $input = file_get_contents('php://input');
    
    // If the content type is application/x-www-form-urlencoded, parse it
    if (strpos($_SERVER['CONTENT_TYPE'], 'application/x-www-form-urlencoded') !== false) {
        parse_str($input, $data); // Parse the raw input into an associative array
    } else {
        // Otherwise, assume the input is in JSON format
        $data = json_decode($input, true);
    }
}

switch ($method) {

         case 'POST':
      if (isset($_GET['action']) && $_GET['action'] === 'login') {
           loginUser($mysqli, $data);
       } else {
           createUser($mysqli, $data);
       }
        break;


    }
// Create a new user
function createUser($mysqli, $data) {
    $email = $data['email'];
    $username = $data['username'];
   
    
      // Check if the email already exists
    $emailCheckQuery = "SELECT email FROM users WHERE email = ?";
    $stmt = $mysqli->prepare($emailCheckQuery);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Email exists, send error response
        echo json_encode([
            'error' => 'Email already exists',
            'emailExist' => 'User already exists, please choose another email!'
        ]);
        return;
    }
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $token = bin2hex(random_bytes(32));

    $query = "INSERT INTO users (email, username, password, token) VALUES (?, ?, ?, ?)";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('ssss', $email, $username, $password, $token);
    
    if ($stmt->execute()) {
        $userId = $mysqli->insert_id;
        $response['message'] = 'User created successfully';
        $response['user_id'] = $userId; // Include the user_id in the response
        $response['token'] = $token; // Include the user_id in the response
    } else {
        $response['error'] = 'Failed to create user';
    }
    echo json_encode($response);
}

// Login user
function loginUser($mysqli, $data) {
    $email = $data['email'];
    $password = $data['password'];

    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        if (password_verify($password, $user['password']) &&  $user['token'] != "") {
            echo json_encode(['message' => 'Login successful', 'userId' => $user['id'],  'token' => $user['token']]);
        } else {
            echo json_encode(['message' => 'Invalid email or password']);
        }
    } else {
        echo json_encode(['message' => 'Invalid email or password']);
    }
}