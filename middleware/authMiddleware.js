const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();
const secretKey = process.env.secretKey;




exports.authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.sendStatus(401);

  try {

    const decodedToken = jwt.verify(token, secretKey);
    req.adminId = decodedToken.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
}
