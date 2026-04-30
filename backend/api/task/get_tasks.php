<?php

include "../connect.php";

$project_id = isset($_GET['project_id']) ? intval($_GET['project_id']) : 0;

if ($project_id <= 0) {
    echo json_encode([]);
    exit();
}
try{
$stmt = $con->prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY id DESC");
$stmt->bind_param("i", $project_id);
$stmt->execute();

$result = $stmt->get_result();

$tasks = [];

while ($row = $result->fetch_assoc()) {
    $row['completed'] = (bool)$row['completed'];
    $tasks[] = $row;
}

echo json_encode($tasks);
}catch(Ex $e){
    echo json_encode($e);
}

?>