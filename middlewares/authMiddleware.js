const jwt = require("jsonwebtoken");
const statusCodes = require("../utils/statusCode");
const messages = require("../utils/messages");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(statusCodes.UNAUTHORIZED).json({ message: messages.UNAUTHORIZED_ACCESS }); 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(statusCodes.UNAUTHORIZED).json({ message: messages.UNAUTHORIZED_ACCESS });
  }
};

module.exports = { protect };
