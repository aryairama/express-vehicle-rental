import typesModel from '../models/types.js';
import { response, responsePagination } from '../helpers/helpers.js';

const createType = async (req, res, next) => {
  try {
    const data = {
      type_name: req.body.type_name,
    };
    const addType = await typesModel.insertType(data);
    if (addType.affectedRows) {
      response(res, 'success', 200, 'successfully added type data', data);
    }
  } catch (error) {
    next(error);
  }
};

const updateType = async (req, res, next) => {
  try {
    const data = {
      type_name: req.body.type_name,
    };
    const checkExistType = await typesModel.checkExistType(req.params.id, 'type_id');
    if (checkExistType.length > 0) {
      const changeDataType = await typesModel.updateType(data, req.params.id);
      if (changeDataType.affectedRows) {
        response(res, 'success', 200, 'successfully updated type data', data);
      }
    } else {
      response(res, 'failed', 404, 'the data you want to update does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const readType = async (req, res, next) => {
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
    if (fieldOrder.toLowerCase() === 'type_name') {
      fieldOrder = 'type_name';
    } else {
      fieldOrder = 'type_id';
    }
  } else {
    fieldOrder = 'type_id';
  }
  try {
    let dataUsers;
    let pagination;
    const lengthRecord = Object.keys(await typesModel.readType(search, order, fieldOrder)).length;
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
      dataUsers = await typesModel.readType(search, order, fieldOrder, start, limit);
      responsePagination(res, 'success', 200, 'data types', dataUsers, pagination);
    } else {
      dataUsers = await typesModel.readType(search, order, fieldOrder);
      response(res, 'success', 200, 'data types', dataUsers);
    }
  } catch (error) {
    next(error);
  }
};

export default { createType, updateType, readType };
