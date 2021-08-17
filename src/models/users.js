import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

const checkExistUser = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM users where ${field} = ?`, fieldValue, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const insertUser = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO users set ?', data, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const updateUser = (data, id) => new Promise((resolve, reject) => {
  connection.query('UPDATE users set ? where user_id = ?', [data, id], (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

export default { checkExistUser, insertUser, updateUser };
