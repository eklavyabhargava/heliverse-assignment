require('dotenv').config();

const mongoose = require('mongoose');

const connectDb = async () => {
    const MONGODB_URL = process.env.MONGODB_URL

    // try to connect db
    try {
        await mongoose.connect(MONGODB_URL)
        console.log('Connected to db')
    } catch (error) {
        console.log("Error occurred while connecting to database: ", error)
        process.exit(1)
    }
}

module.exports = connectDb;