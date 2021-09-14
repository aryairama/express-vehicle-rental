const {
  body, param, query, validationResult,
} = require('express-validator');
const { responseError } = require('../helpers/helpers');
const typesModel = require('../models/types');

const validateResult = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    responseError(res, 'error', 422, 'invalid input', error.array());
  }
};

const rulesCreateUpdateType = () => [
  body('type_name')
    .notEmpty()
    .withMessage('type name is required')
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage('type name length between 3 to 255')
    .bail()
    .custom(async (value) => {
      const existingtype = await typesModel.checkExistType(value, 'type_name');
      if (existingtype.length > 0) {
        throw new Error('type name already registered');
      }
    }),
];

const rulesReadUpdateDelete = () => [
  param('id')
    .isNumeric()
    .withMessage('id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('id must be more than 0'),
];

const rulesRead = () => [
  query('limit')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('limit must be number')
    .bail()
    .isFloat({ min: 1 })
    .withMessage('limit must be more than 0'),
  query('page')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('page must be number')
    .bail()
    .isFloat({ min: 1 })
    .withMessage('page must be more than 0'),
  query('fieldOrder')
    .optional({ nullable: true })
    .notEmpty()
    .withMessage('fieldOrder is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('fieldOrder must be more than 0'),
];

const validate = (method) => {
  if (method === 'create') {
    return [rulesCreateUpdateType(), validateResult];
  }
  if (method === 'update') {
    return [rulesCreateUpdateType(), rulesReadUpdateDelete(), validateResult];
  }
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
  if (method === 'delete') {
    return [rulesReadUpdateDelete(), validateResult];
  }
};

module.exports = validate;
