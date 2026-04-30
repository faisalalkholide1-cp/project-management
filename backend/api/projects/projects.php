<?php

include "../connect.php";


//  Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
 
    case 'GET':

        if (isset($_GET['id'])) {

            $id = intval($_GET['id']);

            if ($id <= 0) {
                echo json_encode(["status" => "error", "message" => "Invalid id"]);
                exit();
            }

            $stmt = $con->prepare("SELECT * FROM projects WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();

            $result = $stmt->get_result();
            $project = $result->fetch_assoc();

            echo json_encode([
                "status" => "success",
                "data" => $project
            ]);

        } else {

            $result = $con->query("SELECT * FROM projects ORDER BY id DESC");

            $projects = [];

            while ($row = $result->fetch_assoc()) {
                $projects[] = $row;
            }

            echo json_encode([
                "status" => "success",
                "data" => $projects
            ]);
        }

        break;

    case 'POST':

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['name'], $data['description'])) {
            echo json_encode(["status" => "error", "message" => "Missing data"]);
            exit();
        }

        $name = trim($data['name']);
        $description = trim($data['description']);

        if ($name === '' || $description === '') {
            echo json_encode(["status" => "error", "message" => "Empty fields"]);
            exit();
        }

        $stmt = $con->prepare("INSERT INTO projects (name, description) VALUES (?, ?)");
        $stmt->bind_param("ss", $name, $description);

        $success = $stmt->execute();

        echo json_encode([
            "status" => $success ? "success" : "error"
        ]);

        break;

    case 'PUT':

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['id'], $data['name'], $data['description'])) {
            echo json_encode(["status" => "error", "message" => "Missing data"]);
            exit();
        }

        $id = intval($data['id']);
        $name = trim($data['name']);
        $description = trim($data['description']);

        $stmt = $con->prepare("UPDATE projects SET name = ?, description = ? WHERE id = ?");
        $stmt->bind_param("ssi", $name, $description, $id);

        $success = $stmt->execute();

        echo json_encode([
            "status" => $success ? "success" : "error"
        ]);

        break;


    //  DELETE

    case 'DELETE':

        parse_str($_SERVER['QUERY_STRING'], $params);

        if (!isset($params['id'])) {
            echo json_encode(["status" => "error", "message" => "Missing id"]);
            exit();
        }

        $id = intval($params['id']);

        $stmt = $con->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->bind_param("i", $id);

        $success = $stmt->execute();

        echo json_encode([
            "status" => $success ? "deleted" : "error"
        ]);

        break;


    default:
        echo json_encode([
            "status" => "error",
            "message" => "Invalid method"
        ]);
}