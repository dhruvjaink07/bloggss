const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please login to access data" });
    }

    const verify = jwt.verify(token, process.env.SECRET_KEY);

    // Ensure the user still exists after token is verified
    const user = await User.findById(verify.id);
    if (!user) {
      return res.status(401).json({ message: "The user no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    next(error);
  }
};

module.exports = isAuthenticated;
