import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

const insertImgVehicles = (data) => new Promise((resolve, reject) => {
  connection.query(
    'INSERT INTO vehicle_images (vehicle_id, vehicle_image) VALUES ?',
    [data.map((value) => [value.vehicle_id, value.vehicle_image])],
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

export default { insertImgVehicles };
