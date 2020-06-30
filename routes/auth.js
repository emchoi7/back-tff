const express = require('express');
const {
    login,
    register,
    getMe,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../controllers/auth');

const {protect} = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/me', protect, getMe);

router.get('/forgotpassword', forgotPassword);

router.put('/resetpassword/:resettoken', resetPassword);

router.put('/updatepassword', protect, resetPassword);


module.exports = router;