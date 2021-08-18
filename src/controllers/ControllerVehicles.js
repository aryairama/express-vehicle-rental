import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import locationsModel from '../models/locations.js';
import typesModel from '../models/types.js';
import vehiclesModel from '../models/vehicles.js';
import vehicleImagesModel from '../models/vehicle_images.js';
import { responseError, response, createFolderImg } from '../helpers/helpers.js';

const createVehicle = async (req, res, next) => {
  try {
    const data = {
      location_id: req.body.location_id,
      type_id: req.body.type_id,
      vehicles_name: req.body.vehicles_name,
      price: req.body.price,
      status: req.body.status,
      stock: req.body.stock,
      description: req.body.description,
    };
    const checkExistLocation = await locationsModel.checkExistLocation(req.body.location_id, 'location_id');
    const checkExistType = await typesModel.checkExistType(req.body.type_id, 'type_id');
    if (checkExistLocation.length > 0 && checkExistType.length > 0) {
      const addDataVehicle = await vehiclesModel.insertVehicle(data);
      if (addDataVehicle.affectedRows) {
        createFolderImg('/public/img/vehicle_images');
        const vehicleImage = [];
        if (Array.isArray(req.files.vehicle_image)) {
          const promiseImg = req.files.vehicle_image.map((img) => {
            const fileName = uuidv4() + path.extname(img.name);
            const savePath = path.join(path.dirname(''), '/public/img/vehicle_images', fileName);
            vehicleImage.push({
              vehicle_id: addDataVehicle.insertId,
              vehicle_image: `public/img/vehicle_images/${fileName}`,
            });
            return img.mv(savePath);
          });
          await Promise.all(promiseImg);
        } else {
          const fileName = uuidv4() + path.extname(req.files.vehicle_image.name);
          const savePath = path.join(path.dirname(''), '/public/img/vehicle_images', fileName);
          vehicleImage.push({
            vehicle_id: addDataVehicle.insertId,
            vehicle_image: `public/img/vehicle_images/${fileName}`,
          });
          await req.files.vehicle_image.mv(savePath);
        }
        const addDataImgVehicles = await vehicleImagesModel.insertImgVehicles(vehicleImage);
        if (addDataImgVehicles.affectedRows) {
          response(res, 'success', 200, 'successfully added vehicle data', {
            ...data,
            vehicle_images: [...vehicleImage],
          });
        }
      }
    } else {
      responseError(res, 'Wrong data', 404, 'the data entered is not correct', []);
    }
  } catch (error) {
    next(error);
  }
};

export default { createVehicle };
