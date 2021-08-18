import express from 'express';
import ControllerLocations from '../controllers/ControllerLocations.js';
import ValidationLocations from '../validations/ValidationLocations.js';
import { Auth, Role } from '../middlewares/Auth.js';

const router = express.Router();

router
  .post('/', Auth, Role('admin'), ValidationLocations('create'), ControllerLocations.createLocation)
  .get('/', ValidationLocations('read'), ControllerLocations.readLocation)
  .put('/:id', Auth, Role('admin'), ValidationLocations('update'), ControllerLocations.updateLocation)
  .delete('/:id', Auth, Role('admin'), ValidationLocations('delete'), ControllerLocations.deleteLocation);

export default router;
