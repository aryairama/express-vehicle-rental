import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

const insertReservation = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO rental set ?', data, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const readReservation = (search, order, fieldOrder, start = '', limit = '', roles, userid) => new Promise((resolve, reject) => {
  let extraQuery = '';
  if (roles === 'user') {
    extraQuery = `AND users.user_id = ${userid}`;
  }
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT rental.*,
      users.email,users.name,
      vehicles.vehicles_name,vehicles.price AS vehicle_price,vehicles.stock AS vehicle_stock,
      types.*,
      extra_cost.cost AS extra_cost
      FROM rental
      INNER JOIN users ON users.user_id = rental.user_id
      INNER JOIN vehicles ON vehicles.vehicle_id = rental.vehicle_id
      LEFT JOIN extra_cost ON rental.rental_id = extra_cost.rental_id
      INNER JOIN types ON types.type_id = vehicles.type_id
      WHERE (vehicles.vehicles_name  LIKE "%${search}%" AND types.type_name LIKE "%${search}%") ${extraQuery}
      ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT rental.*,
      users.email,users.name,
      vehicles.vehicles_name,vehicles.price AS vehicle_price,vehicles.stock AS vehicle_stock,
      types.*,
      extra_cost.cost AS extra_cost
      FROM rental
      INNER JOIN users ON users.user_id = rental.user_id
      INNER JOIN vehicles ON vehicles.vehicle_id = rental.vehicle_id
      LEFT JOIN extra_cost ON rental.rental_id = extra_cost.rental_id
      INNER JOIN types ON types.type_id = vehicles.type_id
      WHERE (vehicles.vehicles_name  LIKE "%${search}%" AND types.type_name LIKE "%${search}%") ${extraQuery}
      ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

export default { insertReservation, readReservation };
