import express from 'express';
import ControllerUsers from '../controllers/ControllerUsers.js';
import ValidationUsers from '../validations/ValidationUsers.js';
import { Auth, Role } from '../middlewares/Auth.js';

const router = express.Router();

router
  .get('/', Auth, Role('admin'), ValidationUsers('read'), ControllerUsers.readUser)
  .post('/register', ValidationUsers('register'), ControllerUsers.register)
  .post('/login', ValidationUsers('login'), ControllerUsers.login)
  .post('/refreshtoken', ValidationUsers('refreshToken'), ControllerUsers.refreshToken)
  .delete('/logout', Auth, Role('user', 'admin'), ControllerUsers.logout)
  .post('/:id', Auth, Role('user', 'admin'), ValidationUsers('update'), ControllerUsers.updateUser);

export default router;
