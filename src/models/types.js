const connection = require('../configs/db');
const { promiseResolveReject } = require('../helpers/helpers');

const checkExistType = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM types where ${field} = ?`, fieldValue, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const insertType = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO types set ?', data, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const updateType = (data, id) => new Promise((resolve, reject) => {
  connection.query('UPDATE types set ? where type_id = ?', [data, id], (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const readType = (search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT * FROM types WHERE type_name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT * FROM types WHERE type_name LIKE "%${search}%" ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const checkRelationTypeVehicle = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT vehicles.*, types.* FROM types INNER JOIN vehicles on types.type_id = vehicles.type_id
    WHERE types.type_id = ?`,
    id,
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const deleteType = (id) => new Promise((resolve, reject) => {
  connection.query('DELETE FROM types where type_id = ?', id, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

module.exports = {
  checkExistType,
  insertType,
  updateType,
  readType,
  checkRelationTypeVehicle,
  deleteType,
};
