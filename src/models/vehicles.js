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

const readVehicle = (search, order, fieldOrder, start = '', limit = '', locationName, typeName) => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT locations.*, types.*, vehicles.*,
      (SELECT vehicle_image FROM vehicle_images WHERE vehicle_images.vehicle_id = vehicles.vehicle_id LIMIT 1) AS vehicle_image
      FROM vehicles INNER JOIN locations ON locations.location_id = vehicles.location_id INNER JOIN types ON types.type_id = vehicles.type_id
      WHERE (vehicles.vehicles_name LIKE "%${search}%" AND locations.location_name LIKE "%${locationName}%" AND types.type_name LIKE "%${typeName}%") 
      ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT locations.*, types.*, vehicles.*,
      (SELECT vehicle_image FROM vehicle_images WHERE vehicle_images.vehicle_id = vehicles.vehicle_id LIMIT 1) AS vehicle_image
      FROM vehicles INNER JOIN locations ON locations.location_id = vehicles.location_id INNER JOIN types ON types.type_id = vehicles.type_id
      WHERE (vehicles.vehicles_name LIKE "%${search}%" AND locations.location_name LIKE "%${locationName}%" 
      AND types.type_name LIKE "%${typeName}%") ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const detailVehicle = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT locations.*,types.*,vehicles.* FROM vehicles INNER JOIN locations ON locations.location_id = vehicles.location_id
    INNER JOIN types ON types.type_id = vehicles.type_id WHERE vehicles.vehicle_id = ?`, id, (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

export default {
  insertVehicle,
  checkExistVehicle,
  updateVehicle,
  checkRelationVehicleRental,
  deleteVehicle,
  readVehicle,
  detailVehicle,
};
