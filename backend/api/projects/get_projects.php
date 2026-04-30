<?php

include "../connect.php";

try{

$result = $con->query("SELECT * FROM projects");

$projects = [];

while ($row = $result->fetch_assoc()) {
    $projects[] = $row; 
}

echo json_encode($projects);
}catch(Ex $e){
    echo json_encode($e);
}
?>