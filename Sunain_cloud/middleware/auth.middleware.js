const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, 'shhhhhh');

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.redirect('/login');
    }

    req.user = user; // REAL user from DB
    next();
  } catch (err) {
    return res.redirect('/login');
  }
};
