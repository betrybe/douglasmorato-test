const jwt = require('jsonwebtoken');

module.exports = async function verifyJWT(req, res, _next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'missing auth token' });

  jwt.verify(token.split(' ')[1], 'mysecret', async (err, decoded) => {
    const message = 'jwt malformed';
    if (err) return res.status(401).json({ message });

    req.decoded = decoded;

    _next();
  });
};
