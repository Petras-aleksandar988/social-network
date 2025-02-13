<?php
include 'db.php';

$headers = getallheaders();
$token = $headers['Authorization'] ?? '';

if (empty($token)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Check if token exists in database
$stmt = $mysqli->prepare("SELECT id FROM users WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}

// Token is valid, proceed with API request
$method = $_SERVER['REQUEST_METHOD'];

// Fetch request body
// Initialize $data
$data = null;

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

// Route handling
switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getUser($mysqli, $_GET['id']);
        } else {
            getUsers($mysqli);
        }
        break;
    case 'PUT':
        if (isset($_GET['id'])) {
            updateUser($mysqli, $_GET['id'], $data);
        }
        break;
    case 'DELETE':
        if (isset($_GET['id'])) {
            deleteUser($mysqli, $_GET['id']);
        }
        break;
    default:
        echo json_encode(['message' => 'Method not allowed']);
        break;
}

// Fetch all users
function getUsers($mysqli) {
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : null;
    
    $query = "SELECT * FROM users";
    $result = $mysqli->query($query);
    
    if ($result->num_rows > 0) {
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        
        if ($limit && $limit > 0) {
            $users = array_slice($users, 0, $limit);
        }
        
        echo json_encode($users);
    } else {
        echo json_encode(['message' => 'No users found']);
    }
}

// Fetch a single user by ID
function getUser($mysqli, $id) {
    $query = "SELECT * FROM users WHERE id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode($user);
    } else {
        echo json_encode(['message' => 'User not found']);
    }
}

// Update user
function updateUser($mysqli, $id, $data) {
    // Fetch current user data
    $query = "SELECT email, username, logo, password FROM users WHERE id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['message' => 'User not found']);
        return;
    }

    $user = $result->fetch_assoc(); // Get current user data

    // Use current values if not provided in $data
    $email = isset($data['email']) && !empty($data['email']) ? $data['email'] : $user['email'];
    $username = isset($data['username']) && !empty($data['username']) ? $data['username'] : $user['username'];
    $logo = isset($data['logo']) && !empty($data['logo']) ? $data['logo'] : $user['logo'];
    
    // Update password only if it's provided, otherwise keep the old password
    $password = isset($data['password']) && !empty($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : $user['password'];

    // Prepare and execute the update query
    $query = "UPDATE users SET email = ?, username = ?, logo = ?, password = ? WHERE id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('ssssi', $email, $username, $logo, $password, $id);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'User updated successfully']);
    } else {
        echo json_encode(['message' => 'Failed to update user']);
    }
}


// Delete user
function deleteUser($mysqli, $id) {
    // First delete related posts and comments
    $mysqli->query("DELETE FROM posts WHERE user_id = $id");
    $mysqli->query("DELETE FROM comments WHERE user_id = $id");
    
    // Now delete the user
    $query = "DELETE FROM users WHERE id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('i', $id);
    
    if ($stmt->execute()) {
        echo json_encode(['message' => "User with id $id deleted successfully"]);
    } else {
        echo json_encode(['message' => 'Failed to delete user']);
    }
}
?>
