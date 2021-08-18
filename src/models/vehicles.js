import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

const insertVehicle = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO vehicles set ?', data, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const checkExistVehicle = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM vehicles where ${field} = ?`, fieldValue, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const updateVehicle = (data, id) => new Promise((resolve, reject) => {
  connection.query('UPDATE vehicles set ? where vehicle_id  = ? ', [data, id], (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const checkRelationVehicleRental = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT vehicles.*, rental.* FROM vehicles INNER JOIN rental ON vehicles.vehicle_id = rental.vehicle_id
    WHERE vehicles.vehicle_id = ?`,
    id,
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const deleteVehicle = (id) => new Promise((resolve, reject) => {
  connection.query('DELETE FROM vehicles where vehicle_id = ?', id, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

export default {
  insertVehicle,
  checkExistVehicle,
  updateVehicle,
  checkRelationVehicleRental,
  deleteVehicle,
};
