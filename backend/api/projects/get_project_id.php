<?php
include "../connect.php";

if (!isset($_GET['id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing id"
    ]);
    exit();
}

$id = $_GET['id'];
$id = intval($_GET['id']);

if ($id <= 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid id"
    ]);
    exit();
}
try{
    
$stmt = $con->prepare("SELECT * FROM projects WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode($row);

}catch(Ex $e){
    echo json_encode($e);
}
?>