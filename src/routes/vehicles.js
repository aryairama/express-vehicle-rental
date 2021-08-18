import express from 'express';
import ControllerVehicles from '../controllers/ControllerVehicles.js';
import ValidationVehicles from '../validations/ValidationVehicles.js';
import { Auth, Role } from '../middlewares/Auth.js';

const router = express.Router();

router
  .get('/', ValidationVehicles('read'), ControllerVehicles.readVehicle)
  .post('/', Auth, Role('admin'), ValidationVehicles('create'), ControllerVehicles.createVehicle)
  .get('/:id', ValidationVehicles('detail'), ControllerVehicles.detailVehicle)
  .put('/:id', Auth, Role('admin'), ValidationVehicles('update'), ControllerVehicles.updateVehicle)
  .delete('/:id', Auth, Role('admin'), ValidationVehicles('delete'), ControllerVehicles.deleteVehicle);
export default router;
