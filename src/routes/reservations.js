import express from 'express';
import ControllerReservations from '../controllers/ControllerReservations.js';
import ValidationReservations from '../validations/ValidationReservations.js';
import { Auth, Role } from '../middlewares/Auth.js';

const router = express.Router();

router
  .get('/', Auth, Role('user', 'admin'), ValidationReservations('read'), ControllerReservations.history)
  .post('/', Auth, Role('user'), ValidationReservations('create'), ControllerReservations.addReservation)
  .get('/:id', Auth, Role('user', 'admin'), ValidationReservations('detail'), ControllerReservations.detailReservation);

export default router;
