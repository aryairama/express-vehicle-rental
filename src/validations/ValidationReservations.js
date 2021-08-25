import {
  body, query, param, validationResult,
} from 'express-validator';
import { responseError } from '../helpers/helpers.js';

const validateResult = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    responseError(res, 'error', 422, 'invalid input', error.array());
  }
};

const rulesCreadReserVation = () => [
  body('vehicle_id')
    .isNumeric()
    .withMessage('vehilce_id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('vehilce_id must be more than 0')
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage('vehilce_id must be more than 0 and less than 10 digits'),
  body('cost')
    .isNumeric()
    .withMessage('cost must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('cost must be more than 0')
    .bail()
    .isLength({ min: 1 })
    .withMessage('cost must be more than 0'),
  body('start_date')
    .notEmpty()
    .withMessage('start_date is required')
    .bail()
    .isDate()
    .withMessage('start_date must be date'),
  body('long_borrowed')
    .notEmpty()
    .withMessage('long_borrowed is required')
    .bail()
    .isIn(['1', '2', '3', '4', '5', '6', '7'])
    .withMessage('the value of the long_borrowed must be 1,2,3,4,5,6,7'),
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .bail()
    .isIn(['pending', 'returned', 'canceled', 'approved'])
    .withMessage('the value of the status must be approved,canceled,returned,pending'),
  body('payment')
    .notEmpty()
    .withMessage('payment is required')
    .bail()
    .isIn(['transfer', 'cash'])
    .withMessage('the value of the status must be transfer,cash'),
  body('quantity')
    .isNumeric()
    .withMessage('quantity must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('quantity must be more than 0')
    .bail()
    .isLength({ min: 1 })
    .withMessage('quantity must be more than 0'),
  body('invoice_number').notEmpty().withMessage('invoice_number is required'),
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

const rulesUpdateAndDelete = () => [
  param('id')
    .isNumeric()
    .withMessage('id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('id must be more than 0'),
];

const validate = (method) => {
  if (method === 'create') {
    return [rulesCreadReserVation(), validateResult];
  }
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
  if (method === 'detail') {
    return [rulesUpdateAndDelete(), validateResult];
  }
};

export default validate;
