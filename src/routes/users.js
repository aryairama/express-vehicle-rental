const express = require('express');
const ControllerUsers = require('../controllers/ControllerUsers');
const ValidationUsers = require('../validations/ValidationUsers');
const { Auth, Role } = require('../middlewares/Auth');

const router = express.Router();

router
  .get('/', Auth, Role('admin'), ValidationUsers('read'), ControllerUsers.readUser)
  .get('/profile', Auth, Role('admin', 'user'), ControllerUsers.profile)
  .post('/register', ValidationUsers('register'), ControllerUsers.register)
  .post('/login', ValidationUsers('login'), ControllerUsers.login)
  .post('/refreshtoken', ControllerUsers.refreshToken)
  .post('/tokenverifemail', ControllerUsers.checkTokenVerifEmail)
  .post('/verifemail', ControllerUsers.verifEmail)
  .delete('/logout', Auth, Role('user', 'admin'), ControllerUsers.logout)
  .post('/:id', Auth, Role('user', 'admin'), ValidationUsers('update'), ControllerUsers.updateUser);

module.exports = router;
