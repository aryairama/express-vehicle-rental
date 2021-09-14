const connection = require('../configs/db');
const { promiseResolveReject } = require('../helpers/helpers');

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
      (SELECT vehicle_image FROM vehicle_images WHERE vehicle_images.vehicle_id = vehicles.vehicle_id LIMIT 1) AS vehicle_image,
      types.*,
      extra_cost.cost AS extra_cost
      FROM rental
      INNER JOIN users ON users.user_id = rental.user_id
      INNER JOIN vehicles ON vehicles.vehicle_id = rental.vehicle_id
      LEFT JOIN extra_cost ON rental.rental_id = extra_cost.rental_id
      INNER JOIN types ON types.type_id = vehicles.type_id
      WHERE (vehicles.vehicles_name LIKE "%${search}%" OR types.type_name LIKE "%${search}%") ${extraQuery}
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
      (SELECT vehicle_image FROM vehicle_images WHERE vehicle_images.vehicle_id = vehicles.vehicle_id LIMIT 1) AS vehicle_image,
      types.*,
      extra_cost.cost AS extra_cost
      FROM rental
      INNER JOIN users ON users.user_id = rental.user_id
      INNER JOIN vehicles ON vehicles.vehicle_id = rental.vehicle_id
      LEFT JOIN extra_cost ON rental.rental_id = extra_cost.rental_id
      INNER JOIN types ON types.type_id = vehicles.type_id
      WHERE (vehicles.vehicles_name LIKE "%${search}%" OR types.type_name LIKE "%${search}%") ${extraQuery}
      ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const detailRental = (id, userId, roles) => new Promise((resolve, reject) => {
  let extraQuery = '';
  if (roles === 'user') {
    extraQuery = `AND rental.user_id = ${userId}`;
  }
  connection.query(
    `SELECT rental.*,
  users.user_id,users.name,users.email,users.phone_number,
  vehicles.vehicles_name,vehicles.price AS vehicle_price,
  (SELECT vehicle_image FROM vehicle_images WHERE vehicle_images.vehicle_id = vehicles.vehicle_id LIMIT 1) AS vehicle_image,
  extra_cost.cost AS extra_cost,
  locations.*
  FROM rental JOIN users ON users.user_id = rental.user_id
  JOIN vehicles ON vehicles.vehicle_id = rental.vehicle_id
  LEFT JOIN extra_cost on rental.rental_id = extra_cost.rental_id
  JOIN locations ON locations.location_id = vehicles.location_id
  WHERE rental.rental_id = ? ${extraQuery}`,
    id,
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const checkExisReservation = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM rental where ${field} = ?`, fieldValue, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const updateReservation = (data, id) => new Promise((resolve, reject) => {
  connection.query('UPDATE rental set ? where rental_id  = ? ', [data, id], (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

module.exports = {
  insertReservation,
  readReservation,
  detailRental,
  checkExisReservation,
  updateReservation,
};
