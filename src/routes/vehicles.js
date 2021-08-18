import express from 'express';
import ControllerVehicles from '../controllers/ControllerVehicles.js';
import ValidationVehicles from '../validations/ValidationVehicles.js';
import { Auth, Role } from '../middlewares/Auth.js';

const router = express.Router();

router.post('/', Auth, Role('admin'), ValidationVehicles('create'), ControllerVehicles.createVehicle);
export default router;
