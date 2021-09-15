const multer = require('multer');

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, './src/uploads');
  },
  filename(_req, file, cb) {
    const { id } = _req.params;
    cb(null, `${id}.jpeg`);
  },
});

module.exports = multer({ storage });
