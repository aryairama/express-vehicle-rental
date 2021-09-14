const express = require('express');
const ControllerVehicles = require('../controllers/ControllerVehicles');
const ValidationVehicles = require('../validations/ValidationVehicles');
const { Auth, Role } = require('../middlewares/Auth');

const router = express.Router();

router
  .get('/', ValidationVehicles('read'), ControllerVehicles.readVehicle)
  .post('/', Auth, Role('admin'), ValidationVehicles('create'), ControllerVehicles.createVehicle)
  .get('/:id', ValidationVehicles('detail'), ControllerVehicles.detailVehicle)
  .put('/:id', Auth, Role('admin'), ValidationVehicles('update'), ControllerVehicles.updateVehicle)
  .delete('/:id', Auth, Role('admin'), ValidationVehicles('delete'), ControllerVehicles.deleteVehicle)
  .get('/type/:id', ValidationVehicles('read'), ControllerVehicles.readVehicleByType);
module.exports = router;
