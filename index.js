/* eslint-disable no-unused-vars */
import express from 'express';
import path from 'path';
import 'dotenv/config';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { responseError } from './src/helpers/helpers.js';

const app = express();
const port = process.env.PORT_APPLICATION;
app.use('/public', express.static(path.resolve('./public')));
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'));
});
app.use((err, req, res, next) => {
  responseError(res, 'Error', 500, err.message, []);
});
app.listen(port, () => {
  console.log(`server running port ${port}`);
});
