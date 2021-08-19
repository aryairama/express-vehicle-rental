import express from 'express';
import ControllerTypes from '../controllers/ControllerTypes.js';
import ValidationTypes from '../validations/ValidationTypes.js';
import { Auth, Role } from '../middlewares/Auth.js';

const router = express.Router();

router
  .post('/', Auth, Role('admin'), ValidationTypes('create'), ControllerTypes.createType)
  .get('/', ValidationTypes('read'), ControllerTypes.readType)
  .put('/:id', Auth, Role('admin'), ValidationTypes('update'), ControllerTypes.updateType)
  .get('/:id', ValidationTypes('delete'), ControllerTypes.detailType)
  .delete('/:id', Auth, Role('admin'), ValidationTypes('delete'), ControllerTypes.deleteType);

export default router;
