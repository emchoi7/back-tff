const express = require('express');
const {
    getRecords,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord
} = require('../controllers/record');

const {protect} = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getRecords)
    .post(protect, createRecord);
router.route('/:recordid')
    .get(protect, getRecord)
    .put(protect, updateRecord)
    .delete(protect, deleteRecord);


module.exports = router;