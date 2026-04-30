<?php

include "../connect.php";


$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['title'], $data['description'], $data['project_id'])
) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing data"
    ]);
    exit();
}

$title = trim($data['title']);
$description = trim($data['description']);
$project_id = intval($data['project_id']);

if ($project_id <= 0 || $title === '' || $description === '') {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid data"
    ]);
    exit();
}
try{
    
$stmt = $con->prepare("
    INSERT INTO tasks (project_id, title, description) 
    VALUES (?, ?, ?)
");

$stmt->bind_param("iss", $project_id, $title, $description);

$success = $stmt->execute();

echo json_encode([
    "status" => $success ? "success" : "error"
]);

$stmt->close();
$con->close();
}catch(Ex $e){
    echo json_encode([
    "status" => $e
]);
}