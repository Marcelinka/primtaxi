<?php
/*
	Апи для работы с БД Примтакси
	Все функции рассчитаны на юр. лиц
	
	Общие выходные параметры:
		'empty fields' если нет входных параметров

	auth
		Проверка на существование пользователя в базе данных
		Входные параметры:
			{
				'login' => <логин_пользователя>,
				'password' => <пароль_пользователя>
			}
		Выходные параметры:
			1. 'login error' если такого пользователя не существует
			2. 'password error' если неправильный пароль
			3. объект с id и name, если все верно

	actual
		Вывод всех актуальных заказов
		Входные параметры:
			{
				'id' => <id_пользователя>
			}

*/

class primTaxi {
	private $connection;

	// Создаем соединение с БД и сохраняем в переменной
	function __construct($server, $database, $username='', $password='') {
		try {
			$this->connection = new PDO("sqlsrv:Server=".$server.";Database=".$database, $username, $password);
		} catch(Exception $e) {
			die('error connection');
		}
	}
	// Обнуляем соединение
	function __destruct() {
		$this->connection = null;
	}

  function auth($data) {
		if(!array_key_exists('login', $data) || !array_key_exists('password', $data)
				|| !$data['login'] || !$data['password']) {
			return 'empty fields';
		}
		$query = "SELECT [id], [web_password], [name]
		  FROM [dbo].[legal_person]
		  WHERE [web_login] = ?";
		$stmt = $this->connection->prepare($query, array( PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL ));
		$stmt->execute(array($data['login']));

		if($stmt->rowCount()) {
			$user = $stmt->fetch( PDO::FETCH_ASSOC );
			if($user['web_password'] == $data['password']) {
				unset($user['web_password']);
				return $user;
			} else {
				return 'password error';
			}
		} else {
			return 'login error';
		}
	}

	function actual($data) {
		if(!array_key_exists('id', $data) || !$data['id'] ) {
			return 'empty fields';
		}
		$query = "SELECT
			[id], 
			[date_begin],
			[date_arrival],
			[date_end],
			[addr_from],
			[addr_to],
			[client_name],
			[cost],
			[car_number]
			FROM [dbo].[orderInfo](?)
			WHERE [id_state] NOT IN (6, 7) AND [id_closed_result] IS NULL;";
		$stmt = $this->connection->prepare($query, array( PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL ));
		$stmt->execute(array($data['id']));

		return $stmt->fetchall(PDO::FETCH_ASSOC);
	}

	function archive($data) {
		if(!array_key_exists('id', $data) || !$data['id'] ) {
			return 'empty fields';
		}
		$query = "SELECT
			[id],
			[date_begin],
			[date_arrival],
			[date_end],
			[addr_from],
			[addr_to],
			[client_name],
			[cost],
			[car_number],
			[id_closed_result]
			FROM [dbo].[orderInfo](?)
			WHERE [id_state] IN (6, 7) AND [id_closed_result] IS NOT NULL";
		$stmt = $this->connection->prepare($query, array( PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL ));
		$stmt->execute(array($data['id']));

		return $stmt->fetchall(PDO::FETCH_ASSOC);
	}

	function order($data) {
		if(!array_key_exists('id', $data) || !array_key_exists('order_id', $data) || 
				!$data['id'] || !$data['order_id'] ) {
			return 'empty fields';
		}

		$query = "SELECT
			[id],
			[date_begin],
			[date_arrival],
			[date_end],
			[addr_from],
			[addr_to],
			[client_name],
			[cost],
			[car_number],
			[id_closed_result],
			[duration],
			[route_length],
			[lat_from],
		  [lon_from],
		  [lat_to],
		  [lon_to]
			FROM [dbo].[orderInfo](?)
			WHERE [id]=?";
		$stmt = $this->connection->prepare($query, array( PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL ));
		$stmt->execute(array($data['id'], $data['order_id']));

		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	function gps($data) {
    if(!array_key_exists('order', $data) || !$data['order'] ) {
      return 'empty fields';
    }
    $query = "SELECT [lat], [lon] as lng FROM 
      [dbo].[gps_data] WHERE [order]=?
	    ORDER BY [gps_data_time]";
    $stmt = $this->connection->prepare($query, array( PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL ));
    $stmt->execute(array($data['order']));

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
}

?>