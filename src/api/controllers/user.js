const express = require('express');

const verifyJWT = require('../middleware/verifyJWT');

const router = express.Router();
const UserService = require('../services/userService');

const validatorEmail = require('../../utils/validatorEmail');

router.get('/users', async (req, res) => {
  res.json(await UserService.getAll(req));
});

router.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  res.json(await UserService.getById(id));
});

const postuser = async (req, res) => {
  const user = req.body;

  const isnotvalid = !user.email || !user.password || !user.name || !validatorEmail(user.email);

  if (isnotvalid) {
    return res.status(400).json({ message: 'Invalid entries. Try again.' });
  }
  const retorno = await UserService.insert(user);

  return res.status(retorno.status).send(retorno.return);
};

router.post('/users', postuser);

router.post('/users/admin', verifyJWT, async (req, res) => {
  if (req.decoded.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can register new admins' });
  }
  req.body = { ...req.body, role: 'admin' };
  return postuser(req, res);
});

module.exports = {
  router,
};
