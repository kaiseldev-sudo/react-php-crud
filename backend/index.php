<?php
    include_once './config/db.php';
    include_once './header.php';
    
    header('Content-Type: application/json');

    $res = ['error' => false];
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    switch($action) {
        case 'fetch':
            fetchData();
            break;

        case 'delete':
            deleteUser();
            break;
        case 'update':
            updateUser();
            break;
        case 'insert':
            insertUser();
            break;
        default:
            $res = [
                'type' => 'error',
                'message' => 'Invalid action'
            ];
            echo json_encode($res);
            break;
    }

    function fetchData() {
        global $connect;

        $stmt = $connect->prepare("SELECT * FROM users");
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        $data = [];
        while($users = $result->fetch_assoc()) {
            $data[] = $users;
        }

        echo json_encode($data);
    }

    function deleteUser() {
        global $connect;

        $data = json_decode(file_get_contents('php://input'), true);

        if(isset($data['userId'])) {
            $uid = $data['userId'];

            $stmt = $connect->prepare("DELETE FROM users WHERE uid = ?");
            $stmt->bind_param('i', $uid);
            $stmt->execute();
            $stmt->close();

            $json = [
                'type' => 'success',
                'message' => 'User deleted'
            ];
        } else {
            $json = [
                'type' => 'error',
                'message' => 'Something went wrong'
            ];
        }

        echo json_encode($json);

        $data = json_decode(file_get_contents('php://input'), true);

        
    }

    function updateUser(){
        global $connect;

        $data = json_decode(file_get_contents('php://input'), true);

        if($data) {
            $uid = $data['uid'];
            $uname = $data['uname'];
            $ucontact = $data['ucontact'];

            if($uid && $uname && $ucontact) {
                $stmt = $connect->prepare("UPDATE users SET uname = ?, ucontact = ? WHERE uid = ?");
                $stmt->bind_param("ssi", $uname, $ucontact, $uid);
                if($stmt->execute()) {
                    echo json_encode(['type' => 'success', 'message' => 'User updated successfully']);
                } else {
                    echo json_encode(['type' => 'error', 'message' => 'Failed to update user']);
                }
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Invalid input']);
            }
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Invalid JSON']);
        }

    }

    function insertUser(){
        global $connect;

        $data = json_decode(file_get_contents('php://input'), true);

        if($data) {
            $uname = $data['uname'];
            $ucontact = $data['ucontact'];

            if($uname && $ucontact) {
                $stmt = $connect->prepare("INSERT INTO users (uname, ucontact) VALUES (?, ?)");
                $stmt->bind_param("ss", $uname, $ucontact);
                if($stmt->execute()) {
                    echo json_encode(['type' => 'success', 'message' => 'User inserted successfully']);
                } else {
                    echo json_encode(['type' => 'error', 'message' => 'Failed to insert user']);
                }
            } else {
                echo json_encode(['type' => 'error', 'message' => 'Invalid input']);
            }
        } else {
            echo json_encode(['type' => 'error', 'message' => 'Invalid JSON']);
        }

    }

?>