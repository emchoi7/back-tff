const express = require('express');
const {
    getRecords,
    getRecord,
    createRecord,
    // editRecord,
    // deleteRecord
} = require('../controllers/record');

const {protect} = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, getRecords).post(protect, createRecord);
router.get('/:recordid', protect, getRecord);


module.exports = router;