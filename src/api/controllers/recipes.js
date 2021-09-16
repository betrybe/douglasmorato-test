const express = require('express');

const upload = require('../config/storage');

const router = express.Router();

const verifyJWT = require('../middleware/verifyJWT');

const RecipesService = require('../services/recipesService');

const postOrPut = async (req, res) => {
  const { id } = req.params;
  const recipe = req.body;

  const isnotvalid = !recipe.name || !recipe.ingredients || !recipe.preparation;

  if (isnotvalid) {
    return res.status(400).json({ message: 'Invalid entries. Try again.' });
  }
  const data = id
    ? { ...recipe, _id: id, userId: req.decoded._id }
    : { ...recipe, userId: req.decoded._id };
  return RecipesService.upsert(data);
};

router.get('/recipes', async (req, res) => {
  res.json(await RecipesService.getAll(req));
});

router.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;

  const data = await RecipesService.getById(id);
  return res.status(data.status).send(data.return);
});

router.post('/recipes', verifyJWT, async (req, res) => {
  const data = await postOrPut(req, res);

  return res.status(data.status).send(data.return);
});

router.put('/recipes/:id', verifyJWT, async (req, res) => {
  const { id } = req.params;
  const recipe = (await RecipesService.getById(id)).return;
  if (req.decoded.role === 'admin' || req.decoded._id === recipe.userId.toString()) {
    const data = await postOrPut(req, res);
    return res.status(data.status).send(data.return);
  }
  return res.status(401).send({ message: 'not authorized' });
});

router.put('/recipes/:id/image', verifyJWT, upload.single('image'), async (req, res, next) => {
  const { id } = req.params;
  const recipe = (await RecipesService.getById(id)).return;
  if (req.decoded.role === 'admin' || req.decoded._id === recipe.userId.toString()) {
    const { file } = req;
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }
    const { host } = req.headers;
    const { path } = file;
    const image = host.concat('/').concat(path);
    req.body = { ...recipe, image };

    const data = await postOrPut(req, res);
    return res.status(data.status).send(data.return);
  }
  return res.status(401).send({ message: 'not authorized' });
});

router.delete('/recipes/:id', verifyJWT, async (req, res) => {
  const { id } = req.params;
  const recipe = (await RecipesService.getById(id)).return;

  if (req.decoded.role === 'admin' || req.decoded._id === recipe.userId.toString()) {
    const data = await RecipesService.delete(id);
    return res.status(data.status).send(data.return);
  }
  return res.status(401).send({ message: 'not authorized' });
});

module.exports = {
  router,
};
