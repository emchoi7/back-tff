const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

const User = require('./models/User');
const Record = require('./models/Record');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const users = require('./data/Users.json');
const records = require('./data/Records.json');

// const updateRecordsDate = () => {
//     // update records' dates to recent so that we can test 
//     // but keep edge cases
// }

const importData = async () => {
    try{
        await User.create(users);
        await Record.create(records);

        console.log('Data imported'.green.inverse);
        process.exit();
    } catch(err) {
        console.log(err);
    }
};

const deleteData = async () => {
    try{
        await User.deleteMany();
        await Record.deleteMany();

        console.log('Data deleted'.red.inverse);
        process.exit();
    } catch(err) {
        console.log(err);
    }
};

if(process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}