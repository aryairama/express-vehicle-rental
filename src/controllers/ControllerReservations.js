import vehiclesModel from '../models/vehicles.js';
import reservationsModel from '../models/reservations.js';
import { response, responseError } from '../helpers/helpers.js';

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

export default {
  addReservation,
};
