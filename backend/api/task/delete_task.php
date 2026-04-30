<?php

include "../connect.php";

if (!isset($_GET['id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing id"
    ]);
    exit();
}

$id = intval($_GET['id']);

if ($id <= 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid id"
    ]);
    exit();
}
try{
$stmt = $con->prepare("DELETE FROM tasks WHERE id = ?");
$stmt->bind_param("i", $id);

$success = $stmt->execute();

echo json_encode([
    "status" => $success ? "deleted" : "error"
]);

$stmt->close();
$con->close();
}catch(Ex $e){
    echo json_encode([
    "status" => $e
]);
}