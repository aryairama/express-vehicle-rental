const express = require('express');
const ControllerLocations = require('../controllers/ControllerLocations');
const ValidationLocations = require('../validations/ValidationLocations');
const { Auth, Role } = require('../middlewares/Auth');

const router = express.Router();

router
  .post('/', Auth, Role('admin'), ValidationLocations('create'), ControllerLocations.createLocation)
  .get('/', ValidationLocations('read'), ControllerLocations.readLocation)
  .put('/:id', Auth, Role('admin'), ValidationLocations('update'), ControllerLocations.updateLocation)
  .delete('/:id', Auth, Role('admin'), ValidationLocations('delete'), ControllerLocations.deleteLocation);

module.exports = router;
