const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const locationsModel = require('../models/locations');
const typesModel = require('../models/types');
const vehiclesModel = require('../models/vehicles');
const vehicleImagesModel = require('../models/vehicle_images');
const {
  responseError, response, createFolderImg, responsePagination,
} = require('../helpers/helpers');

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

const updateVehicle = async (req, res, next) => {
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
    const checkExistVehicle = await vehiclesModel.checkExistVehicle(req.params.id, 'vehicle_id');
    if (checkExistVehicle.length > 0) {
      if (checkExistLocation.length > 0 && checkExistType.length > 0) {
        const checkExistImgVehicles = await vehicleImagesModel.checkImgVehicles(
          req.body.old_vehicle_image,
          req.params.id,
        );
        const dataImgVehicles = await vehicleImagesModel.getAllImgVehicles(req.params.id);
        if (req.body.old_vehicle_image && checkExistImgVehicles.length !== req.body.old_vehicle_image.length) {
          return responseError(res, 'Wrong data', 404, 'The data entered is not correct', []);
        }
        if (
          !req.body.vehicle_image
          && req.body.old_vehicle_image
          && dataImgVehicles.length === req.body.old_vehicle_image.length
        ) {
          return responseError(res, 'Wrong action', 403, 'All product images cannot be deleted', []);
        }
        if (Array.isArray(req.body.old_vehicle_image)) {
          checkExistImgVehicles.forEach((img) => {
            fs.unlink(path.join(path.dirname(''), `/${img.vehicle_image}`));
          });
          await vehicleImagesModel.deleteImgVehicles(req.body.old_vehicle_image, req.params.id);
        }
        createFolderImg('/public/img/vehicle_images');
        const vehicleImage = [];
        if (Array.isArray(req.body.vehicle_image) && req.body.vehicle_image) {
          const promiseImg = req.files.vehicle_image.map((img) => {
            const fileName = uuidv4() + path.extname(img.name);
            const savePath = path.join(path.dirname(''), '/public/img/vehicle_images', fileName);
            vehicleImage.push({
              vehicle_id: req.params.id,
              vehicle_image: `public/img/vehicle_images/${fileName}`,
            });
            return img.mv(savePath);
          });
          await Promise.all(promiseImg);
        } else if (!Array.isArray(req.body.vehicle_image) && req.body.vehicle_image) {
          const fileName = uuidv4() + path.extname(req.files.vehicle_image.name);
          const savePath = path.join(path.dirname(''), '/public/img/vehicle_images', fileName);
          vehicleImage.push({
            vehicle_id: req.params.id,
            vehicle_image: `public/img/vehicle_images/${fileName}`,
          });
          await req.files.vehicle_image.mv(savePath);
        }
        if (req.body.vehicle_image) {
          await vehicleImagesModel.insertImgVehicles(vehicleImage);
        }
        const changeDataVehicle = await vehiclesModel.updateVehicle(data, req.params.id);
        if (changeDataVehicle.affectedRows) {
          response(res, 'success', 200, 'successfully updated vehicle data', {
            ...data,
            vehicle_images: [...vehicleImage],
          });
        }
      } else {
        responseError(res, 'Wrong data', 404, 'the data entered is not correct', []);
      }
    } else {
      response(res, 'failed', 404, 'the data you want to update does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const checkExistVehicle = await vehiclesModel.checkExistVehicle(req.params.id, 'vehicle_id');
    const checkRealtion = await vehiclesModel.checkRelationVehicleRental(req.params.id);
    if (checkExistVehicle.length > 0) {
      if (checkRealtion.length === 0) {
        const dataImgVehicles = await vehicleImagesModel.getAllImgVehicles(req.params.id);
        const removeDataVehicle = await vehiclesModel.deleteVehicle(req.params.id);
        if (removeDataVehicle.affectedRows) {
          dataImgVehicles.forEach((img) => {
            fs.unlink(path.join(path.dirname(''), `/${img.vehicle_image}`));
          });
          response(res, 'success', 200, 'successfully deleted product data', []);
        }
      } else if (checkRealtion.length > 0) {
        response(res, 'data relation', 409, 'product data cannot be deleted because it is related to other data', []);
      }
    } else {
      response(res, 'failed', 404, 'the data you want to delete does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const readVehicle = async (req, res, next) => {
  const StatusPagination = req.query.pagination || 'on';
  const locationName = req.query.location_name || '';
  const typeName = req.query.type_name || '';
  const search = req.query.search || '';
  let order = req.query.order || '';
  if (order.toUpperCase() === 'ASC') {
    order = 'ASC';
  } else if (order.toUpperCase() === 'DESC') {
    order = 'DESC';
  } else {
    order = 'DESC';
  }
  let { fieldOrder } = req.query;
  if (fieldOrder) {
    if (fieldOrder.toLowerCase() === 'vehicles_name') {
      fieldOrder = 'vehicles_name';
    } else if (fieldOrder.toLowerCase() === 'count_rental') {
      fieldOrder = 'count_rental';
    } else {
      fieldOrder = 'vehicle_id';
    }
  } else {
    fieldOrder = 'vehicle_id';
  }
  try {
    let dataUsers;
    let pagination;
    const lengthRecord = Object.keys(
      await vehiclesModel.readVehicle(search, order, fieldOrder, '', '', locationName, typeName),
    ).length;
    if (lengthRecord > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(lengthRecord / limit);
      let page = req.query.page || 1;
      let nextPage = parseInt(page, 10) + 1;
      let prevPage = parseInt(page, 10) - 1;
      if (nextPage > pages) {
        nextPage = pages;
      }
      if (prevPage < 1) {
        prevPage = 1;
      }
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      pagination = {
        countData: lengthRecord,
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      if (StatusPagination === 'on') {
        dataUsers = await vehiclesModel.readVehicle(search, order, fieldOrder, start, limit, locationName, typeName);
        return responsePagination(res, 'success', 200, 'data types', dataUsers, pagination);
      }
      dataUsers = await vehiclesModel.readVehicle(search, order, fieldOrder, '', '', locationName, typeName);
      response(res, 'success', 200, 'data types', dataUsers);
    } else {
      dataUsers = await vehiclesModel.readVehicle(search, order, fieldOrder, '', '', locationName, typeName);
      response(res, 'success', 200, 'data types', dataUsers);
    }
  } catch (error) {
    next(error);
  }
};

const detailVehicle = async (req, res, next) => {
  try {
    const checkExistVehicle = await vehiclesModel.checkExistVehicle(req.params.id, 'vehicle_id');
    const detail = await vehiclesModel.detailVehicle(req.params.id);
    const getAllImgVehicles = await vehicleImagesModel.getAllImgVehicles(req.params.id);
    if (checkExistVehicle.length > 0) {
      const data = {
        ...detail[0],
        vehicle_images: getAllImgVehicles,
      };
      response(res, 'success', 200, 'detail vehicle', data);
    } else {
      responseError(res, 'failed', 404, 'data not found', []);
    }
  } catch (error) {
    next(error);
  }
};

const readVehicleByType = async (req, res, next) => {
  const locationName = req.query.location_name || '';
  const typeName = req.query.type_name || '';
  const search = req.query.search || '';
  let order = req.query.order || '';
  if (order.toUpperCase() === 'ASC') {
    order = 'ASC';
  } else if (order.toUpperCase() === 'DESC') {
    order = 'DESC';
  } else {
    order = 'DESC';
  }
  let { fieldOrder } = req.query;
  if (fieldOrder) {
    if (fieldOrder.toLowerCase() === 'vehicles_name') {
      fieldOrder = 'vehicles_name';
    } else {
      fieldOrder = 'vehicle_id';
    }
  } else {
    fieldOrder = 'vehicle_id';
  }
  try {
    let dataUsers;
    let pagination;
    const lengthRecord = Object.keys(
      await vehiclesModel.readVehicleByType(search, order, fieldOrder, '', '', locationName, typeName, req.params.id),
    ).length;
    if (lengthRecord > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(lengthRecord / limit);
      let page = req.query.page || 1;
      let nextPage = parseInt(page, 10) + 1;
      let prevPage = parseInt(page, 10) - 1;
      if (nextPage > pages) {
        nextPage = pages;
      }
      if (prevPage < 1) {
        prevPage = 1;
      }
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      pagination = {
        countData: lengthRecord,
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      dataUsers = await vehiclesModel.readVehicleByType(
        search,
        order,
        fieldOrder,
        start,
        limit,
        locationName,
        typeName,
        req.params.id,
      );
      responsePagination(res, 'success', 200, 'data types', dataUsers, pagination);
    } else {
      dataUsers = await vehiclesModel.readVehicleByType(
        search,
        order,
        fieldOrder,
        '',
        '',
        locationName,
        typeName,
        req.params.id,
      );
      response(res, 'success', 200, 'data types', dataUsers);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  readVehicle,
  detailVehicle,
  readVehicleByType,
};
