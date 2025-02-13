<?php
include 'db.php';

// Get the request method
$method = $_SERVER['REQUEST_METHOD'];

// Fetch request body
$data = null;

// Fetch request body based on request method
if ($method === 'POST' || $method === 'PUT') {
    $input = file_get_contents('php://input');
    
    if (strpos($_SERVER['CONTENT_TYPE'], 'application/x-www-form-urlencoded') !== false) {
        parse_str($input, $data);
    } else {
        $data = json_decode($input, true);
    }
}

// Route handling
switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            getComment($mysqli, $_GET['id']);
        } else {
            getComments($mysqli);
        }
        break;
    case 'POST':
        createComment($mysqli, $data);
        break;
    case 'PUT':
        if (isset($_GET['id'])) {
            updateComment($mysqli, $_GET['id'], $data);
        }
        break;
    case 'DELETE':
        if (isset($_GET['id'])) {
            deleteComment($mysqli, $_GET['id']);
        }
        break;
    default:
        header('HTTP/1.1 405 Method Not Allowed');
        echo json_encode(['message' => 'Method not allowed']);
        break;
}

// Functions

// @desc   Get all comments
// @route  GET /api/comments
function getComments($mysqli) {
    $query = "SELECT * FROM comments";
    $result = $mysqli->query($query);

    if ($result) {
        $comments = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($comments);
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['message' => 'Failed to fetch comments']);
    }
}

// @desc    Get single comment
// @route   GET /api/comments/:id
function getComment($mysqli, $id) {
    $id = (int)$id; // Ensure ID is an integer
    $query = "SELECT * FROM comments WHERE id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $comment = $result->fetch_assoc();

    if ($comment) {
        echo json_encode($comment);
    } else {
        header('HTTP/1.1 404 Not Found');
        echo json_encode(['message' => 'Comment not found']);
    }
}

// @desc    Create new comment
// @route   POST /api/comments
function createComment($mysqli, $data) {
    $user_id = $data['user_id'] ?? null;
    $post_id = $data['post_id'] ?? null;
    $content = $data['content'] ?? null;
   
    if ($user_id && $post_id && $content) {
        $query = 'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('iis', $user_id, $post_id, $content);

        if ($stmt->execute()) {
            $comment_id = $stmt->insert_id;
            $query = 'SELECT * FROM comments WHERE id = ?';
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('i', $comment_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $comment = $result->fetch_assoc();
            echo json_encode($comment);
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(['message' => 'Failed to create comment']);
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['message' => 'Invalid input data']);
    }
}

// @desc    Update comment
// @route   PUT /api/comments/:id
function updateComment($mysqli, $id, $data) {
    $id = (int)$id; // Ensure ID is an integer
    $content = $data['content'] ?? null;

    if ($content) {
        $query = 'UPDATE comments SET content = ? WHERE id = ?';
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('si', $content, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Comment updated successfully']);
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(['message' => 'Failed to update comment']);
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['message' => 'Invalid input data']);
    }
}

// @desc    Delete comment
// @route   DELETE /api/comments/:id
function deleteComment($mysqli, $id) {
    $id = (int)$id; // Ensure ID is an integer
    $query = 'DELETE FROM comments WHERE id = ?';
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Comment deleted successfully']);
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['message' => 'Failed to delete comment']);
    }
}
