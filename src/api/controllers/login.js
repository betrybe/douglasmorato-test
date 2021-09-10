const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const userService = require('../services/userService');

router.post('/login', async (req, res, _next) => {
  // esse teste abaixo deve ser feito no seu banco de dados

  if (!req.body.email || !req.body.password) {
    return res.status(401).json({ message: 'All fields must be filled' });
  }

  const user = await userService.getByLogin(req.body.email);

  if (!user || req.body.password !== user.password) {
    return res.status(401).json({ message: 'Incorrect username or password' });
  }
  // auth ok
  const { _id, name } = user; // esse id viria do banco de dados

  const token = jwt.sign({ _id, name }, 'mysecret', {
    expiresIn: 60 * 60 * 8, // expires in 8 horas
  });
  return res.status(200).json({ token });
});

module.exports = {
  router,
};
