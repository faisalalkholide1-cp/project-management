<?php

include "../connect.php";

$result = $con->query("SELECT * FROM projects");

$projects = [];

while ($row = $result->fetch_assoc()) {
    $projects[] = $row; 
}

echo json_encode($projects);
?>