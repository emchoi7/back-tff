const express = require('express');
const {
    getRecords,
    // getRecord,
    // createRecord,
    // editRecord,
    // deleteRecord
} = require('../controllers/record');

const {protect} = require('../middleware/auth');

const router = express.Router();

router.get('/:userid/records', protect, getRecords);
// router.get('/:userid/records/:recordid', getRecord);

module.exports = router;