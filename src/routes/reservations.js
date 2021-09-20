const express = require('express');
const ControllerReservations = require('../controllers/ControllerReservations');
const ValidationReservations = require('../validations/ValidationReservations');
const { Auth, Role } = require('../middlewares/Auth');

const router = express.Router();

router
  .get('/', Auth, Role('user', 'admin'), ValidationReservations('read'), ControllerReservations.history)
  .post('/', Auth, Role('user'), ValidationReservations('create'), ControllerReservations.addReservation)
  .patch('/:id', Auth, Role('user', 'admin'), ValidationReservations('update'), ControllerReservations.updateReservation)
  .get('/:id', ValidationReservations('detail'), ControllerReservations.detailReservation);
  // .get('/:id', Auth, Role('user', 'admin'), ValidationReservations('detail'), ControllerReservations.detailReservation);

module.exports = router;
