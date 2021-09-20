const vehiclesModel = require('../models/vehicles');
const reservationsModel = require('../models/reservations');
const { response, responseError, responsePagination } = require('../helpers/helpers');

const addReservation = async (req, res, next) => {
  try {
    const checkExistVehicle = await vehiclesModel.checkExistVehicle(req.body.vehicle_id, 'vehicle_id');
    if (checkExistVehicle.length > 0) {
      const data = {
        invoice_number: req.body.invoice_number,
        user_id: req.userLogin.user_id,
        vehicle_id: req.body.vehicle_id,
        cost: req.body.quantity * req.body.long_borrowed * parseInt(checkExistVehicle[0].price, 10),
        start_date: req.body.start_date,
        long_borrowed: req.body.long_borrowed,
        status: 'pending',
        payment: req.body.payment,
        quantity: req.body.quantity,
      };
      const addDataReservation = await reservationsModel.insertReservation(data);
      if (addDataReservation.affectedRows) {
        response(res, 'success', 200, 'successfully added reservation data', data);
      }
    } else {
      return responseError(res, 'Wrong data', 404, 'The data entered is not correct', []);
    }
  } catch (error) {
    next(error);
  }
};

const history = async (req, res, next) => {
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
    if (fieldOrder.toLowerCase() === 'name') {
      fieldOrder = 'vehicles.vehicle_id';
    } else if (fieldOrder.toLowerCase() === 'type') {
      fieldOrder = 'types.type_id';
    } else {
      fieldOrder = 'rental.rental_id';
    }
  } else {
    fieldOrder = 'rental.rental_id';
  }
  try {
    let dataUsers;
    let pagination;
    const lengthRecord = Object.keys(
      await reservationsModel.readReservation(
        search,
        order,
        fieldOrder,
        '',
        '',
        req.userLogin.roles,
        req.userLogin.user_id,
      ),
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
      dataUsers = await reservationsModel.readReservation(
        search,
        order,
        fieldOrder,
        start,
        limit,
        req.userLogin.roles,
        req.userLogin.user_id,
      );
      responsePagination(res, 'success', 200, 'data history', dataUsers, pagination);
    } else {
      dataUsers = await reservationsModel.readReservation(
        search,
        order,
        fieldOrder,
        '',
        '',
        req.userLogin.roles,
        req.userLogin.user_id,
      );
      response(res, 'success', 200, 'data history', dataUsers);
    }
  } catch (error) {
    next(error);
  }
};

const detailReservation = async (req, res, next) => {
  try {
    const detail = await reservationsModel.detailRental(req.params.id, req.userLogin.user_id, req.userLogin.roles);
    if (detail.length > 0) {
      response(res, 'success', 200, 'Detail reservation', detail[0]);
    } else {
      responseError(res, 'failed', 404, 'data not found', []);
    }
  } catch (error) {
    next(error);
  }
};

const updateReservation = async (req, res, next) => {
  try {
    const checkExisReservation = await reservationsModel.checkExisReservation(req.params.id, 'rental_id');
    if (checkExisReservation.length > 0) {
      let data = {
        status: req.body.status,
      };
      if (req.body.status === 'returned') {
        data = { ...data, return_date: new Date().toISOString().slice(0, 10) };
      }
      const dataUpdateReservation = await reservationsModel.updateReservation(data, req.params.id);
      if (dataUpdateReservation.affectedRows) {
        response(res, 'success', 200, 'successfully update reservation data', { status: req.body.status });
      }
    } else {
      responseError(res, 'failed', 404, 'data not found', []);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReservation,
  history,
  detailReservation,
  updateReservation,
};
