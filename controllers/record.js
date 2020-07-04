const Record = require('../models/Record');
const ErrorResponse = require('../utils/errorResponse');
const AsyncHandler = require('../middleware/async');

// @desc    Get records
// @route   GET /api/v1/records
// @access  Private
exports.getRecords = AsyncHandler( async (req, res, next) => {
    let records;
    if(req.query.year || req.query.month || req.query.day){
        const {year, month, day} = req.query;

        let dateStart;
        let dateEnd;

        if(!(year && month && !day) && !(year && month && day)) {
            return next(new ErrorResponse('Please enter a valid date (year and month or year, month, and day)', 400));
        } else if(month && year) {
            // get all records from month
            dateStart = new Date(Number(year), Number(month)-1, 1);
            dateStart = dateStart.getTime();
            dateEnd = dateStart + 30 * 24 * 60 * 60 * 1000
        } else {
            // get all records from day
            dateStart = new Date(Number(year), Number(month)-1, day);
            dateStart = dateStart.getTime();
            dateEnd = dateStart + 24 * 60 * 60 * 1000;
        }
        records = await Record.find({
            user: req.user.id,
            createdAt: {
                $gt: dateStart,
                $lt: dateEnd
            }
        });
    } else {
        records = await Record.find({
            user: req.user.id
        });
    }

    res.status(200).json({
        success: true,
        data: records
    });
    
});

// @desc    Get a single record
// @route   GET /api/v1/records/:recordid
// @access  Private
exports.getRecord = AsyncHandler( async (req, res, next) => {
    const record = await Record.findById(req.params.recordid);

    if(!record) {
        return next(new ErrorResponse(`No record with the id ${req.params.recordid}`, 404));
    }

    if(record.user != req.user.id) {
        return next(new ErrorResponse('Not authorized to access this record', 401));
    }

    res.status(200).json({
        success: true,
        data: record
    });
    
});

// @desc    Create a record
// @route   POST /api/v1/records/
// @access  Private
exports.createRecord = AsyncHandler( async (req, res, next) => {
    req.body.user = req.user.id;

    const record = await Record.create(req.body);

    res.status(200).json({
        success: true,
        data: record
    });
    
});