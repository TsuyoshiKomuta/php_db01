<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $address = $_POST['address'];
    $birth_date = $_POST['birth_date'];
    $death_date = isset($_POST['death_date']) ? $_POST['death_date'] : NULL;
    $land = $_POST['land'];
    $building = $_POST['building'];
    $money = $_POST['money'];

    $stmt = $conn->prepare("INSERT INTO characters (id, name, address, birth_date, death_date, land, building, money) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, address=?, birth_date=?, death_date=?, land=?, building=?, money=?");
    $stmt->bind_param("issssssssssssss", $id, $name, $address, $birth_date, $death_date, $land, $building, $money, $name, $address, $birth_date, $death_date, $land, $building, $money);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(['status' => 'success']);
}
