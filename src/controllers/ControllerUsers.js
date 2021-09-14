import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs/promises';
import checkFolder from 'fs';
import Jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import usersModel from '../models/users.js';
import { redis } from '../configs/redis.js';
import { genAccessToken, genRefreshToken, genVerifEmailToken } from '../helpers/jwt.js';
import {
  response,
  responseError,
  responsePagination,
  responseCookie,
  sendVerifEmailRegister,
} from '../helpers/helpers.js';

const register = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const data = {
      name: req.body.name,
      email: req.body.email,
      roles: 'user',
      password: await bcrypt.hash(req.body.password, salt),
    };
    const addDataUser = await usersModel.insertUser(data);
    if (addDataUser.affectedRows) {
      delete data.password;
      response(res, 'success', 200, 'successfully added user data', data);
      const token = await genVerifEmailToken({ ...data, user_id: addDataUser.insertId }, { expiresIn: 60 * 60 * 24 });
      await sendVerifEmailRegister(token, data.email, data.name);
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const checkExistUser = await usersModel.checkExistUser(req.body.email, 'email');
    if (checkExistUser.length > 0) {
      if (checkExistUser[0].verif_email === 0) {
        return responseError(res, 'Email not verified', 403, 'Email has not been verified', {});
      } if (checkExistUser[0].account_status !== 'active') {
        return responseError(res, 'Account not Found', 404, 'Your account not found in database', {});
      }
      const comparePassword = await bcrypt.compare(req.body.password, checkExistUser[0].password);
      if (comparePassword) {
        delete checkExistUser[0].password;
        const accessToken = await genAccessToken({ ...checkExistUser[0] }, { expiresIn: 60 * 60 * 2 });
        const refreshToken = await genRefreshToken({ ...checkExistUser[0] }, { expiresIn: 60 * 60 * 4 });
        responseCookie(
          res,
          'Success',
          200,
          'Login success',
          { ...checkExistUser[0] },
          { accessToken, refreshToken },
          {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          },
        );
      } else {
        responseError(res, 'Authorized failed', 401, 'Wrong password', {
          password: 'passwords dont match',
        });
      }
    } else {
      responseError(res, 'Authorized failed', 401, 'User not Found', {
        email: 'email not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    // eslint-disable-next-line no-unused-vars
    redis.del(`jwtRefToken-${req.userLogin.user_id}`, (error, result) => {
      if (error) {
        next(error);
      } else {
        res.clearCookie('authVehicleRental', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });
        response(res, 'Logout', 200, 'Logout success', []);
      }
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.authVehicleRental;
    if (!token) {
      return responseError(res, 'Authorized failed', 401, 'Server need refreshToken', []);
    }
    Jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          responseError(res, 'Authorized failed', 401, 'token expired', []);
        } else if (err.name === 'JsonWebTokenError') {
          responseError(res, 'Authorized failed', 401, 'token invalid', []);
        } else {
          responseError(res, 'Authorized failed', 401, 'token not active', []);
        }
      }
      // eslint-disable-next-line no-unused-vars
      const cacheRefToken = redis.get(`jwtRefToken-${decode.user_id}`, async (error, cacheToken) => {
        if (cacheToken === token.refreshToken) {
          delete decode.iat;
          delete decode.exp;
          redis.del(`jwtRefToken-${decode.user_id}`);
          const accessToken = await genAccessToken(decode, { expiresIn: 60 * 60 * 2 });
          const newRefToken = await genRefreshToken(decode, { expiresIn: 60 * 60 * 4 });
          responseCookie(
            res,
            'Success',
            200,
            'AccessToken',
            {},
            { accessToken, refreshToken: newRefToken },
            {
              httpOnly: true,
              secure: true,
              sameSite: 'none',
            },
          );
        } else {
          responseError(res, 'Authorized failed', 403, 'Wrong refreshToken', []);
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    let data = {
      name: req.body.name,
      gender: req.body.gender,
      phone_number: req.body.phone_number,
      address: req.body.address,
      date_of_birth: req.body.date_of_birth,
    };
    const checkExistUser = await usersModel.checkExistUser(req.params.id, 'user_id');
    if (checkExistUser.length > 0) {
      if (req.body.email) {
        data = { ...data, email: req.body.email };
      }
      if (req.body.roles) {
        if (checkExistUser[0].roles === 'user') {
          data = { ...data, roles: req.body.roles };
        }
      }
      if (req.body.account_status) {
        data = { ...data, account_status: req.body.account_status };
      }
      if (!checkFolder.existsSync(path.join(path.dirname(''), '/public/img/profile_img'))) {
        checkFolder.mkdirSync(path.join(path.dirname(''), '/public/img/profile_img'), { recursive: true });
      }
      if (req.files) {
        if (checkExistUser[0].profile_img && checkExistUser[0].profile_img.length > 10) {
          fs.unlink(path.join(path.dirname(''), `/${checkExistUser[0].profile_img}`));
        }
        const fileName = uuidv4() + path.extname(req.files.profile_img.name);
        const savePath = path.join(path.dirname(''), '/public/img/profile_img', fileName);
        data = { ...data, profile_img: `public/img/profile_img/${fileName}` };
        await req.files.profile_img.mv(savePath);
      }
      const changeDataUser = await usersModel.updateUser(data, req.params.id);
      if (changeDataUser.affectedRows) {
        response(res, 'success', 200, 'successfully updated user data', data);
      }
    } else {
      response(res, 'failed', 404, 'the data you want to update does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const readUser = async (req, res, next) => {
  const search = req.query.search || '';
  let order = req.query.order || '';
  if (order.toUpperCase() === 'ASC') {
    order = 'ASC';
  } else if (order.toUpperCase() === 'DESC') {
    order = 'DESC';
  } else {
    order = 'DESC';
  }
  let { fieldOrder } = req.query;
  if (fieldOrder) {
    if (fieldOrder.toLowerCase() === 'name') {
      fieldOrder = 'name';
    } else if (fieldOrder.toLowerCase() === 'date_of_birth') {
      fieldOrder = 'date_of_birth';
    } else {
      fieldOrder = 'user_id';
    }
  } else {
    fieldOrder = 'user_id';
  }
  try {
    let dataUsers;
    let pagination;
    const lengthRecord = Object.keys(await usersModel.readUser(search, order, fieldOrder)).length;
    if (lengthRecord > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(lengthRecord / limit);
      let page = req.query.page || 1;
      let nextPage = parseInt(page, 10) + 1;
      let prevPage = parseInt(page, 10) - 1;
      if (nextPage > pages) {
        nextPage = pages;
      }
      if (prevPage < 1) {
        prevPage = 1;
      }
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      pagination = {
        countData: lengthRecord,
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      dataUsers = await usersModel.readUser(search, order, fieldOrder, start, limit);
      responsePagination(res, 'success', 200, 'data users', dataUsers, pagination);
    } else {
      dataUsers = await usersModel.readUser(search, order, fieldOrder);
      response(res, 'success', 200, 'data users', dataUsers);
    }
  } catch (error) {
    next(error);
  }
};

const checkTokenVerifEmail = (req, res, next) => {
  try {
    if (!req.cookies.tokenEmail) {
      return responseError(res, 'Check Token failed', 403, 'Server need tokenverifemail', []);
    }
    Jwt.verify(req.cookies.tokenEmail, process.env.VERIF_EMAIL_TOKEN_SECRET, (error, decode) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return responseError(res, 'Authorized failed', 401, 'token expired', []);
        // eslint-disable-next-line no-else-return
        } else if (error.name === 'JsonWebTokenError') {
          return responseError(res, 'Authorized failed', 401, 'token invalid', []);
        } else {
          return responseError(res, 'Authorized failed', 401, 'token not active', []);
        }
      }
      response(res, 'Token Valid', 200, 'Token verif email valid', decode);
    });
  } catch (error) {
    next(error);
  }
};

const verifEmail = async (req, res, next) => {
  try {
    Jwt.verify(req.cookies.tokenEmail, process.env.VERIF_EMAIL_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return responseError(res, 'Verif failed', 403, 'Verif Register Email failed', []);
      }
      redis.get(`jwtEmailVerToken-${decode.user_id}`, async (error, result) => {
        if (result !== null) {
          const updateVerifEmail = await usersModel.updateUser({ verif_email: 1 }, decode.user_id);
          if (updateVerifEmail.affectedRows) {
            redis.del(`jwtEmailVerToken-${decode.user_id}`);
            return response(res, 'success', 200, 'successfully verified email', []);
          }
        } else {
          const checkVerifEmail = await usersModel.checkExistUser(decode.user_id, 'user_id');
          if (checkVerifEmail[0].verif_email === 1) {
            response(res, 'success', 201, 'Email is verified', []);
          } else if (checkVerifEmail[0].verif_email === 0) {
            responseError(res, 'Verif failed', 403, 'Verif Register Email failed', []);
          }
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const getProfile = await usersModel.checkExistUser(req.userLogin.user_id, 'user_id');
    delete getProfile[0].password;
    response(res, 'Success', 200, 'User profile', getProfile[0]);
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  refreshToken,
  updateUser,
  readUser,
  checkTokenVerifEmail,
  verifEmail,
  profile,
};
