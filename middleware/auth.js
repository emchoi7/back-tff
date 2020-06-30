const AsyncHandler = require('./async');
const ErrorHandler = require('./error');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect private routes
exports.protect = AsyncHandler(async (req, res, next) => {
    let token;
    // Grab token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }
    // Make sure that the token exists
    if(!token) {
        return next(new ErrorHandler('Not authorized to access this route', 401));
    }
    // Verify token and grab the corresponding user
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch(err) {
        return next(new ErrorHandler('Not authorized to access this route', 401));
    }
});
