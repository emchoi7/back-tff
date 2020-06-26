const User = require('../models/User');
const ErrorHandler = require('../middleware/error');
const AsyncHandler = require('../middleware/async');

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = AsyncHandler( async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorHandler('Please provide an email and password', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorHandler('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = AsyncHandler( async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password
    });

    sendTokenResponse(user, 200, res);
});

// Get token from the model, create cookie, send response
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken();
    // set options
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 24 * 1000),
        httpOnly: true
    };
    // be secure when in production
    if(process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    
    res.status(statusCode).cookie('token', token, options).json({
        success:true, 
        token
    });
}

// @desc    Get currently logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = AsyncHandler( async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Get password reset token by email
// @route   GET /api/v1/auth/forgotpassword
// @access  Private
exports.forgotPassword = AsyncHandler( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler(`No user found registered with the email ${req.body.email}`, 404));
    }
})