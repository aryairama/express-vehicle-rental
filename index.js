/* eslint-disable no-unused-vars */
const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const usersRouter = require('./src/routes/users');
const locationsRouter = require('./src/routes/location');
const typesRouter = require('./src/routes/types');
const vehiclesRouter = require('./src/routes/vehicles');
const ReservationsRouter = require('./src/routes/reservations');
const { responseError } = require('./src/helpers/helpers');

const app = express();
const port = process.env.PORT_APPLICATION;
app.use('/public', express.static(path.resolve('./public')));
app.use(fileUpload());
app.use(
  cors({
    credentials: JSON.parse(process.env.CREDENTIALS),
    origin(origin, callback) {
      if (process.env.CORS_ORIGIN.indexOf(origin) !== -1 || origin === undefined) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/locations', locationsRouter);
app.use('/types', typesRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/reservations', ReservationsRouter);
app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'));
});
app.use((err, req, res, next) => {
  responseError(res, 'Error', 500, err.message, []);
});
app.listen(port, () => {
  console.log(`server running port ${port}`);
});
