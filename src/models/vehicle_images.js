const connection = require('../configs/db');
const { promiseResolveReject } = require('../helpers/helpers');

const insertImgVehicles = (data) => new Promise((resolve, reject) => {
  connection.query(
    'INSERT INTO vehicle_images (vehicle_id, vehicle_image) VALUES ?',
    [data.map((value) => [value.vehicle_id, value.vehicle_image])],
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const checkImgVehicles = (id, idProduct) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT * FROM vehicle_images WHERE vehicle_id = ${idProduct} AND (image_id) IN (?)`,
    [id],
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const getAllImgVehicles = (id) => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM vehicle_images WHERE vehicle_id = ?', id, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const deleteImgVehicles = (data, idProduct) => new Promise((resolve, reject) => {
  connection.query(
    `DELETE FROM vehicle_images WHERE vehicle_id = ${idProduct} AND (image_id) IN (?)`,
    [data],
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

module.exports = {
  insertImgVehicles,
  checkImgVehicles,
  getAllImgVehicles,
  deleteImgVehicles,
};
