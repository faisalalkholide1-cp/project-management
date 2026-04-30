<?php


include "../connect.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':

        if (isset($_GET['project_id'])) {

            $project_id = intval($_GET['project_id']);

            if ($project_id <= 0) {
                echo json_encode(["status" => "error", "message" => "Invalid project_id"]);
                exit();
            }

            $stmt = $con->prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY id DESC");
            $stmt->bind_param("i", $project_id);
            $stmt->execute();

            $result = $stmt->get_result();
            $tasks = [];

            while ($row = $result->fetch_assoc()) {
                $row['completed'] = (bool)$row['completed'];
                $tasks[] = $row;
            }

            echo json_encode([
                "status" => "success",
                "data" => $tasks
            ]);

        } else {

            $tasks = [];

            while ($row = $result->fetch_assoc()) {
                $row['completed'] = (bool)$row['completed'];
                $tasks[] = $row;
            }

            echo json_encode([
                "status" => "success",
                "data" => $tasks
            ]);
        }

        break;

    case 'POST':

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['title'], $data['description'], $data['project_id'])) {
            echo json_encode(["status" => "error", "message" => "Missing data"]);
            exit();
        }

        $title = trim($data['title']);
        $description = trim($data['description']);
        $project_id = intval($data['project_id']);

        if ($project_id <= 0 || $title === '' || $description === '') {
            echo json_encode(["status" => "error", "message" => "Invalid data"]);
            exit();
        }

        $stmt = $con->prepare("INSERT INTO tasks (project_id, title, description) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $project_id, $title, $description);

        $success = $stmt->execute();

        echo json_encode([
            "status" => $success ? "success" : "error"
        ]);

        break;

    //  PUT (Update / Toggle)
    case 'PUT':

        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['id'])) {
            echo json_encode(["status" => "error", "message" => "Missing id"]);
            exit();
        }

        $id = intval($data['id']);

        if (isset($data['completed'])) {

            $completed = intval($data['completed']);

            if ($completed !== 0 && $completed !== 1) {
                echo json_encode(["status" => "error", "message" => "Invalid completed"]);
                exit();
            }

            $stmt = $con->prepare("UPDATE tasks SET completed = ? WHERE id = ?");
            $stmt->bind_param("ii", $completed, $id);

        } 
        else if (isset($data['title'], $data['description'])) {

            $title = trim($data['title']);
            $description = trim($data['description']);

            $stmt = $con->prepare("UPDATE tasks SET title = ?, description = ? WHERE id = ?");
            $stmt->bind_param("ssi", $title, $description, $id);

        } 
        else {
            echo json_encode(["status" => "error", "message" => "Invalid update data"]);
            exit();
        }

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

        $stmt = $con->prepare("DELETE FROM tasks WHERE id = ?");
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