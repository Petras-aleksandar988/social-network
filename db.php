<?php  
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, API_KEY');

$valid_api_key = '1234';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request
    http_response_code(200);
    exit();
}

$api_key = isset($_SERVER['HTTP_API_KEY']) ? $_SERVER['HTTP_API_KEY'] : null;

// Validate the API key
if (!$api_key || $api_key !== $valid_api_key) {
    // API key is missing or invalid
    http_response_code(403); // Forbidden
    echo json_encode(['error' => 'Access denied. Invalid API key.']);
    exit();
}

// Database credentials
$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'socialusers';

// Database credentials
// $host = 'localhost';
// $user = 'root';
// $pass = '';
// $dbname = 'socialusers';

// Create a new MySQLi connection
$mysqli = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($mysqli->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $mysqli->connect_error]));
}