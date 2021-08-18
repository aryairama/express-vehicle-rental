import {
  body, param, query, validationResult,
} from 'express-validator';
import { responseError } from '../helpers/helpers.js';
import locationsModel from '../models/locations.js';

const validateResult = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    responseError(res, 'error', 422, 'invalid input', error.array());
  }
};

const rulesCreateUpdateLocation = () => [
  body('location_name')
    .notEmpty()
    .withMessage('location name is required')
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage('location name length between 3 to 255')
    .bail()
    .custom(async (value) => {
      const existingLocation = await locationsModel.checkExistLocation(value, 'location_name');
      if (existingLocation.length > 0) {
        throw new Error('Location already registered');
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
    return [rulesCreateUpdateLocation(), validateResult];
  }
  if (method === 'update') {
    return [rulesCreateUpdateLocation(), rulesReadUpdateDelete(), validateResult];
  }
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
};

export default validate;
