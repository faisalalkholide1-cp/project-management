<?php


include "../connect.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'], $data['completed'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing data"]);
    exit();
}

$id = (int)$data['id'];
$completed = (int)$data['completed'];

if ($id <= 0 || ($completed !== 0 && $completed !== 1)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit();
}

$stmt = $con->prepare("UPDATE tasks SET completed = ? WHERE id = ?");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Prepare failed"]);
    exit();
}

$stmt->bind_param("ii", $completed, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Update failed"]);
}

$stmt->close();
$con->close();