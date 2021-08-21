/* eslint-disable no-unused-vars */
import express from 'express';
import path from 'path';
import 'dotenv/config';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import usersRouter from './src/routes/users.js';
import locationsRouter from './src/routes/location.js';
import typesRouter from './src/routes/types.js';
import vehiclesRouter from './src/routes/vehicles.js';
import { responseError } from './src/helpers/helpers.js';

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
app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'));
});
app.use((err, req, res, next) => {
  responseError(res, 'Error', 500, err.message, []);
});
app.listen(port, () => {
  console.log(`server running port ${port}`);
});
