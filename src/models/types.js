import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

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

export default {
  checkExistType,
  insertType,
  updateType,
  readType,
};
