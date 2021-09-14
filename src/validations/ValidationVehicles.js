const {
  body, param, query, validationResult,
} = require('express-validator');
const { responseError } = require('../helpers/helpers');

const validateResult = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    responseError(res, 'error', 422, 'invalid input', error.array());
  }
};

const rulesCreateUpdate = () => [
  body('location_id')
    .isNumeric()
    .withMessage('location_id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('location_id must be more than 0')
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage('location_id must be more than 0 and less than 10 digits'),
  body('type_id')
    .isNumeric()
    .withMessage('type_id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('type_id must be more than 0')
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage('type_id must be more than 0 and less than 10 digits'),
  body('vehicles_name')
    .notEmpty()
    .withMessage('vehicles_name is required')
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage('vehicles_name length between 3 to 255 characters'),
  body('price')
    .notEmpty()
    .withMessage('price is required')
    .bail()
    .toInt()
    .isNumeric()
    .withMessage('price must be number')
    .bail()
    .isLength({ min: 1, max: 255 })
    .withMessage('price must be more than 0 and less than 255 digits')
    .isInt({ min: 1 })
    .withMessage('price must be more than 0'),
  body('status')
    .notEmpty()
    .withMessage('status vehicle is required')
    .bail()
    .isIn(['Available', 'FullBooked'])
    .withMessage('the value of the status vehicle must be Available or FullBooked'),
  body('stock')
    .notEmpty()
    .withMessage('stock is required')
    .bail()
    .toInt()
    .isNumeric()
    .withMessage('stock must be number')
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage('stock must be more than 0 and less than 10 digits'),
  body('description')
    .notEmpty()
    .withMessage('description is required')
    .bail()
    .isLength({ min: 10 })
    .withMessage('vehicle description must be more than 10 characters'),
];

const rulesFileUploud = (req, res, next) => {
  if (req.files) {
    if (req.files.vehicle_image) {
      if (Array.isArray(req.files.vehicle_image)) {
        req.files.vehicle_image.forEach((img) => delete img.data);
        req.body.vehicle_image = [...req.files.vehicle_image];
      } else {
        delete req.files.vehicle_image.data;
        req.body.vehicle_image = { ...req.files.vehicle_image };
      }
    }
  }
  next();
};

const mimetypeImg = (value) => {
  if (Array.isArray(value)) {
    value.forEach((img) => {
      if (img.mimetype !== 'image/png' && img.mimetype !== 'image/jpeg') {
        throw new Error('vehicle_image mmust be jpg or png');
      }
    });
  } else if (value.mimetype !== 'image/png' && value.mimetype !== 'image/jpeg') {
    throw new Error('vehicle_image mmust be jpg or png');
  }
  return true;
};

const maxSizeImg = (value) => {
  if (Array.isArray(value)) {
    value.forEach((img) => {
      if (parseInt(img.size, 10) > 2097152) {
        throw new Error('image size exceeds 2 megabytes');
      }
    });
  } else if (parseInt(value.size, 10) > 2097152) {
    throw new Error('image size exceeds 2 megabytes');
  }
  return true;
};

const rulesCreateImgVehicle = () => [
  body('vehicle_image')
    .notEmpty()
    .withMessage('vehicle_image is required')
    .bail()
    .custom(mimetypeImg)
    .bail()
    .custom(maxSizeImg),
];

const rulesUpdateImgVehicle = () => [
  body('vehicle_image').optional({ checkFalsy: true }).custom(mimetypeImg).bail()
    .custom(maxSizeImg),
];

const isDuplicateArrayExist = (value) => {
  const duplicate = new Set(value).size !== value.length;
  if (duplicate) {
    throw new Error('duplicate color id');
  }
  return true;
};

const rulesUpdateOldImgVehicle = () => [
  body('old_vehicle_image')
    .if((value) => Array.isArray(value))
    .notEmpty()
    .withMessage('old img vehicle is required')
    .bail()
    .isArray({ min: 1 })
    .withMessage('old img vehicle must be array and more than 0')
    .bail()
    .custom(isDuplicateArrayExist),
  body('old_vehicle_image')
    .if((value) => !Array.isArray(value))
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('old_vehicle_image id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('old_vehicle_image id must be more than 0')
    .toArray(),
  body('old_vehicle_image.*')
    .isNumeric()
    .withMessage('old_vehicle_image id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('old_vehicle_image id must be more than 0')
    .toInt(),
];

const rulesUpdateAndDelete = () => [
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
    return [rulesFileUploud, rulesCreateImgVehicle(), rulesCreateUpdate(), validateResult];
  }
  if (method === 'update') {
    return [
      rulesFileUploud,
      rulesUpdateAndDelete(),
      rulesUpdateImgVehicle(),
      rulesCreateUpdate(),
      rulesUpdateOldImgVehicle(),
      validateResult,
    ];
  }
  if (method === 'delete') {
    return [rulesUpdateAndDelete(), validateResult];
  }
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
  if (method === 'detail') {
    return [rulesUpdateAndDelete(), validateResult];
  }
};

module.exports = validate;
