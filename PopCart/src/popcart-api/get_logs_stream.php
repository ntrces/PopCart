<?php
require 'cors_config.php';
require 'db_connect.php';

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

if (!$conn || $conn->connect_error) {
    echo "event: error\n";
    echo 'data: {"success":false,"message":"Database connection failed"}\n\n';
    flush();
    exit();
}

set_time_limit(0);

$last_id = 0;
if (isset($_GET['last_id'])) {
    $last_id = (int)$_GET['last_id'];
}
if (isset($_SERVER['HTTP_LAST_EVENT_ID'])) {
    $last_id = (int)$_SERVER['HTTP_LAST_EVENT_ID'];
}

// Initial payload
$init_query = "SELECT id, user_id, role, action, timestamp FROM (SELECT id, user_id, role, action, timestamp FROM logs WHERE id > ? ORDER BY id DESC LIMIT 100) AS recent_logs ORDER BY id ASC";
$init_stmt = $conn->prepare($init_query);
$init_stmt->bind_param("i", $last_id);
$init_stmt->execute();
$init_result = $init_stmt->get_result();
$init_logs = [];
while ($row = $init_result->fetch_assoc()) {
    $init_logs[] = [
        "id" => (int)$row["id"],
        "user_id" => (int)$row["user_id"],
        "role" => $row["role"],
        "action" => $row["action"],
        "timestamp" => $row["timestamp"]
    ];
}
$init_stmt->close();

$init_payload = ["type" => "init", "logs" => $init_logs];
echo "event: init\n";
echo "data: " . json_encode($init_payload) . "\n\n";
flush();

$last_sent_id = $last_id;
if (!empty($init_logs)) {
    $last_sent_id = $init_logs[count($init_logs) - 1]["id"];
}

while (true) {
    if (connection_aborted()) {
        break;
    }

    $query = "SELECT id, user_id, role, action, timestamp FROM logs WHERE id > ? ORDER BY id ASC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $last_sent_id);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $log = [
            "id" => (int)$row["id"],
            "user_id" => (int)$row["user_id"],
            "role" => $row["role"],
            "action" => $row["action"],
            "timestamp" => $row["timestamp"]
        ];
        $last_sent_id = (int)$row["id"];

        echo "id: " . $last_sent_id . "\n";
        echo "event: log\n";
        echo "data: " . json_encode($log) . "\n\n";
        flush();
    }

    $stmt->close();
    sleep(2);
}

$conn->close();
?>
