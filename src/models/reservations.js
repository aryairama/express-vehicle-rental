import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

const insertReservation = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO rental set ?', data, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

export default { insertReservation };
