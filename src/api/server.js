const app = require('./app');

const { PORT } = process.env;

module.exports = app.listen(PORT || 3000, () => console.log(`conectado na porta ${PORT}`));
