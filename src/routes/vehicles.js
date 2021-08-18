import express from 'express';
import ControllerVehicles from '../controllers/ControllerVehicles.js';
import ValidationVehicles from '../validations/ValidationVehicles.js';
import { Auth, Role } from '../middlewares/Auth.js';

const router = express.Router();

router
  .post('/', Auth, Role('admin'), ValidationVehicles('create'), ControllerVehicles.createVehicle)
  .put('/:id', Auth, Role('admin'), ValidationVehicles('update'), ControllerVehicles.updateVehicle);
export default router;
