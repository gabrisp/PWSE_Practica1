const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const isTest = process.env.TEST_MODE === 'True';
        
        const uri = isTest ? process.env.TEST_DB_URI : process.env.DB_URI;

        await mongoose.connect(uri);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
};

const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error closing database connection:', error);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
    closeDB
}; 