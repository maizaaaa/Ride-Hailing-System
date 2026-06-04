<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Force MySQLi to throw exceptions so our catch block can grab them safely
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli('localhost', 'admin', 'password123', 'ride_hailing_db');

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = $_POST['username'] ?? 'Unknown';
        $role = $_POST['role'] ?? 'Passenger';
        $location = $_POST['location'] ?? '0, 0';
        $ip = $_SERVER['REMOTE_ADDR'];

        $rawTime = $_POST['time'] ?? 'now';
        $time = date("Y-m-d H:i:s", strtotime($rawTime));

        $coords = explode(',', str_replace(' ', '', $location));
        $lat = isset($coords[0]) ? (float) $coords[0] : 0.0;
        $lng = isset($coords[1]) ? (float) $coords[1] : 0.0;

        $stmt = $conn->prepare("INSERT INTO check_ins (driver_id, user_role, latitude, longitude, ip_address, timestamp) VALUES (?, ?, ?, ?, ?, ?)");
        
        $stmt->bind_param("ssddss", $username, $role, $lat, $lng, $ip, $time);
        
        $stmt->execute();
        
        echo json_encode(["status" => "success"]);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $result = $conn->query("SELECT * FROM check_ins ORDER BY id DESC LIMIT 50");
        $data = [];
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    }
    
} catch (Throwable $e) { // <-- CHANGED FROM Exception TO Throwable
    // Now catches FATAL errors too!
    http_response_code(200); 
    echo json_encode([
        "error" => "Critical Crash: " . $e->getMessage(),
        "line" => "Failed on line " . $e->getLine()
    ]);
}
?>