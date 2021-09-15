const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.use('/', require('./controllers/login').router);
app.use('/', require('./controllers/user').router);
app.use('/', require('./controllers/recipes').router);

app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

module.exports = app;
