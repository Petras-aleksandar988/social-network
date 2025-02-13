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
            getPost($mysqli, $_GET['id']);
        } else {
            getPosts($mysqli);
        }
        break;
    case 'POST':
        createPost($mysqli, $data);
        break;
    case 'PUT':
        if (isset($_GET['id'])) {
            updatePost($mysqli, $_GET['id'], $data);
        }
        break;
    case 'DELETE':
        if (isset($_GET['id'])) {
            deletePost($mysqli, $_GET['id']);
        }
        break;
    default:
        header('HTTP/1.1 405 Method Not Allowed');
        echo json_encode(['message' => 'Method not allowed']);
        break;
}

// Functions

function getPosts($mysqli) {
    $query = "SELECT * FROM posts";
    $result = $mysqli->query($query);

    if ($result) {
        $posts = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($posts);
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['message' => 'Failed to fetch posts']);
    }
}

function getPost($mysqli, $id) {
    $id = intval($id);
    $query = "SELECT * FROM posts WHERE id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $post = $result->fetch_assoc();
        echo json_encode(['data' => $post]);
    } else {
        header('HTTP/1.1 404 Not Found');
        echo json_encode(['message' => "Post with id $id not found"]);
    }
}

function createPost($mysqli, $data) {
    $user_id = $data['user_id'] ?? null;
    $content = $data['content'] ?? null;
    $likes = $data['likes'] ?? 0;
   
    if ($user_id && $content) {
        $query = "INSERT INTO posts (user_id, content, likes) VALUES (?, ?, ?)";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('isi', $user_id, $content, $likes);

        if ($stmt->execute()) {
            $post_id = $stmt->insert_id;
            $query = "SELECT * FROM posts WHERE id = ?";
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('i', $post_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $post = $result->fetch_assoc();
            echo json_encode($post);
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(['message' => 'Failed to create post']);
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['message' => 'Invalid input data']);
    }
}

function updatePost($mysqli, $id, $data) {
    $id = intval($id);
    $likes = $data['likes'] ?? null;

    if ($id > 0 && $likes !== null) {
        $query = "UPDATE posts SET likes = ? WHERE id = ?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('ii', $likes, $id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Post updated successfully']);
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(['message' => 'Failed to update post']);
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['message' => 'Invalid ID or data']);
    }
}

function deletePost($mysqli, $id) {
    $id = intval($id);

    if ($id > 0) {
        $query = "DELETE FROM posts WHERE id = ?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param('i', $id);

        try {
            $mysqli->begin_transaction();
            
            $stmt->execute();
            $query = "DELETE FROM comments WHERE post_id = ?";
            $stmt = $mysqli->prepare($query);
            $stmt->bind_param('i', $id);
            $stmt->execute();

            $mysqli->commit();
            echo json_encode(['message' => 'Post deleted successfully']);
        } catch (Exception $e) {
            $mysqli->rollback();
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(['message' => 'Failed to delete post']);
        }
    } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['message' => 'Invalid ID']);
    }
}
?>
