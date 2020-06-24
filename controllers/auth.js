const User = require('../models/User');
const ErrorHandler = require('../middleware/error');

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    res.status(200).json({
        success: true
    })
}

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    console.log(req.body)
    const { name, email, password } = req.body;

    const user = User.create({
        name,
        email,
        password
    });

    res.status(200).json({
        success: true,
        data: user
    }) // return a token...!
}