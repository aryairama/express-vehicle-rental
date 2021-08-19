import locationsModel from '../models/locations.js';
import { response, responsePagination } from '../helpers/helpers.js';

const createLocation = async (req, res, next) => {
  try {
    const data = {
      location_name: req.body.location_name,
    };
    const addLocation = await locationsModel.insertLocation(data);
    if (addLocation.affectedRows) {
      response(res, 'success', 200, 'successfully added location data', data);
    }
  } catch (error) {
    next(error);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    const data = {
      location_name: req.body.location_name,
    };
    const checkExistLocation = await locationsModel.checkExistLocation(req.params.id, 'location_id');
    if (checkExistLocation.length > 0) {
      const changeDataLocation = await locationsModel.updateLocation(data, req.params.id);
      if (changeDataLocation.affectedRows) {
        response(res, 'success', 200, 'successfully updated location data', data);
      }
    } else {
      response(res, 'failed', 404, 'the data you want to update does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const readLocation = async (req, res, next) => {
  const StatusPagination = req.query.pagination || 'on';
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
    if (fieldOrder.toLowerCase() === 'location_name') {
      fieldOrder = 'location_name';
    } else {
      fieldOrder = 'location_id';
    }
  } else {
    fieldOrder = 'location_id';
  }
  try {
    let dataUsers;
    let pagination;
    const lengthRecord = Object.keys(await locationsModel.readLocation(search, order, fieldOrder)).length;
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
        dataUsers = await locationsModel.readLocation(search, order, fieldOrder, start, limit);
        return responsePagination(res, 'success', 200, 'data locations', dataUsers, pagination);
      }
      dataUsers = await locationsModel.readLocation(search, order, fieldOrder);
      response(res, 'success', 200, 'data locations', dataUsers);
    } else {
      dataUsers = await locationsModel.readLocation(search, order, fieldOrder);
      response(res, 'success', 200, 'data locations', dataUsers);
    }
  } catch (error) {
    next(error);
  }
};

const deleteLocation = async (req, res, next) => {
  try {
    const checkExistLocation = await locationsModel.checkExistLocation(req.params.id, 'location_id');
    const checkRelationLocationVehicle = await locationsModel.checkRelationLocationVehicle(req.params.id);
    if (checkExistLocation.length > 0) {
      if (checkRelationLocationVehicle.length === 0) {
        const removeDataLocation = await locationsModel.deleteLocation(req.params.id);
        if (removeDataLocation.affectedRows) {
          response(res, 'success', 200, 'successfully deleted location data', []);
        }
      } else if (checkRelationLocationVehicle.length > 0) {
        response(res, 'data relation', 409, 'product data cannot be deleted because it is related to other data', []);
      }
    } else {
      response(res, 'failed', 404, 'the data you want to delete does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

export default {
  createLocation,
  updateLocation,
  readLocation,
  deleteLocation,
};
