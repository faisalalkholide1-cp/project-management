<?php

include "../connect.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name'], $data['description'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing data"
    ]);
    exit();
}

$name = trim($data['name']);
$description = trim($data['description']);

if ($name === '' || $description === '') {
    echo json_encode([
        "status" => "error",
        "message" => "Empty fields not allowed"
    ]);
    exit();
}

$stmt = $con->prepare("
    INSERT INTO projects (name, description) 
    VALUES (?, ?)
");

$stmt->bind_param("ss", $name, $description);

$success = $stmt->execute();

echo json_encode([
    "status" => $success ? "success" : "error"
]);

$stmt->close();
$con->close();