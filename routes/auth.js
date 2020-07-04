const express = require('express');
const {
    login,
    register,
    getMe,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateInfo,
    logout
} = require('../controllers/auth');

const {protect} = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/me', protect, getMe);

router.get('/forgotpassword', forgotPassword);

router.put('/resetpassword/:resettoken', resetPassword);

router.put('/updatepassword', protect, resetPassword);

router.put('/updateinfo', protect, updateInfo);

router.get('/logout', logout);


module.exports = router;