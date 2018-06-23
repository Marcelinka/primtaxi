<?php
// Подключаем апи
require('primtaxi.api.php');

// Получаем данные, полученные через POST запрос
$_POST = json_decode(file_get_contents('php://input'), true);

$type = $_POST['type']; // Тип запроса, который необходимо совершить
$data = $_POST['data']; // Данные, которые нужно передать

// Создаем объект класса Примтакси
$api = new primTaxi('DESKTOP-KI15UHM\SQLEXPRESS', 'besttaxi');

$results = $api->$type($data);

echo json_encode($results);

?>