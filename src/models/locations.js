import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

const checkExistLocation = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM locations where ${field} = ?`, fieldValue, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const insertLocation = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO locations set ?', data, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const updateLocation = (data, id) => new Promise((resolve, reject) => {
  connection.query('UPDATE locations set ? where location_id = ?', [data, id], (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const readLocation = (search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT * FROM locations WHERE location_name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT * FROM locations WHERE location_name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const checkRelationLocationVehicle = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT vehicles.*, locations.* FROM locations INNER JOIN vehicles on locations.location_id = vehicles.location_id
    WHERE locations.location_id = ?`,
    id,
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const deleteLocation = (id) => new Promise((resolve, reject) => {
  connection.query('DELETE FROM locations where location_id = ?', id, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

export default {
  checkExistLocation,
  insertLocation,
  updateLocation,
  readLocation,
  checkRelationLocationVehicle,
  deleteLocation,
};
