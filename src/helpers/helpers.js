import path from 'path';
import checkFolder from 'fs';

const response = (res, status, statusCode, message, data) => {
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    data,
  });
};
const responsePagination = (res, status, statusCode, message, data, pagination) => {
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    data,
    pagination,
  });
};

const responseError = (res, status, statusCode, message, error) => {
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    error,
  });
};

const promiseResolveReject = (resolve, reject, error, result) => {
  if (!error) {
    resolve(result);
  } else {
    reject(error);
  }
};

const responseCookie = (res, status, statusCode, message, data, dataCookie, optionCookie) => {
  res
    .cookie('authVehicleRental', JSON.stringify(dataCookie), { ...optionCookie })
    .status(statusCode)
    .json({
      status,
      statusCode,
      message,
      data,
    });
};

const createFolderImg = (direktori) => {
  if (!checkFolder.existsSync(path.join(path.dirname(''), direktori))) {
    checkFolder.mkdirSync(path.join(path.dirname(''), direktori), { recursive: true });
  }
};

export {
  response, responseError, promiseResolveReject, responsePagination, createFolderImg, responseCookie,
};
