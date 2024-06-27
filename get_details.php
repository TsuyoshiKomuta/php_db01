<?php
include 'db.php';

$id = $_GET['id'];

$stmt = $conn->prepare("SELECT name, address, birth_date, death_date, land, building, money FROM characters WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo json_encode(['status' => 'error', 'message' => 'データが見つかりませんでした。']);
}

$stmt->close();
$conn->close();
