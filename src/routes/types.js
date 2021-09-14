const express = require('express');
const ControllerTypes = require('../controllers/ControllerTypes');
const ValidationTypes = require('../validations/ValidationTypes');
const { Auth, Role } = require('../middlewares/Auth');

const router = express.Router();

router
  .post('/', Auth, Role('admin'), ValidationTypes('create'), ControllerTypes.createType)
  .get('/', ValidationTypes('read'), ControllerTypes.readType)
  .put('/:id', Auth, Role('admin'), ValidationTypes('update'), ControllerTypes.updateType)
  .get('/:id', ValidationTypes('delete'), ControllerTypes.detailType)
  .delete('/:id', Auth, Role('admin'), ValidationTypes('delete'), ControllerTypes.deleteType);

module.exports = router;
