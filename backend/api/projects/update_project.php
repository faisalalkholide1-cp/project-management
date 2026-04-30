<?php

include "../connect.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'], $data['name'], $data['description'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing data"
    ]);
    exit();
}

$id = intval($data['id']);
$name = trim($data['name']);
$description = trim($data['description']);

if ($id <= 0 || $name === '' || $description === '') {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid data"
    ]);
    exit();
}
try{
$stmt = $con->prepare("
    UPDATE projects 
    SET name = ?, description = ? 
    WHERE id = ?
");

$stmt->bind_param("ssi", $name, $description, $id);

$success = $stmt->execute();

echo json_encode([
    "status" => $success ? "success" : "error"
]);

$stmt->close();
$con->close();

}catch(Ex $e){
    echo json_encode([
    "status" =>  $e
]);
}