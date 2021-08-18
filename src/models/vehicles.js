import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

const insertVehicle = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO vehicles set ?', data, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

export default { insertVehicle };
