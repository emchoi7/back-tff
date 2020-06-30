const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const AsyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = AsyncHandler( async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
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
        return next(new ErrorResponse(`No user found registered with the email ${req.body.email}`, 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `Make a PUT request to ${resetUrl}`;

    // send email 
    try{
        await sendEmail({
            email: user.email,
            subject: "Reset Your Password On Thought For Food",
            message
        });
        
        res.status(200).json({
            success: true,
            data: "Email sent"
        });
    } catch(err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(`Email could not be sent`, 500));
    }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = AsyncHandler( async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user) {
        return next(new ErrorResponse(`Invalid token`, 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.resetPassword = AsyncHandler( async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(req.body.currentPassword)

    if(!isMatch) {
        return next(new ErrorResponse(`Incorrect password`, 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// @desc    Update info
// @route   PUT /api/v1/auth/updateinfo
// @access  Private
exports.updateInfo = AsyncHandler( async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        success: true,
        data: user
    });
});
