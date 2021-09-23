const mongoose = require('mongoose');
const logger = require('./logger');
const { mongoUser, mongoPassword, mongoHost, mongoDatabase, env } = require('./vars');

mongoose.Promise = Promise;

mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

if (env === 'development') {
    mongoose.set('debug', true);
}

exports.connect = () => {
    return new Promise((resolve, reject) => {
        const mongoUrl = "mongodb://"+mongoUser+":"+mongoPassword+"@"+mongoHost+":27017/"+mongoDatabase+"?authSource=admin";
        const options = {
            keepAlive: true,
            keepAliveInitialDelay: 300000,
            autoIndex: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        };
        mongoose.connect(mongoUrl, options).then(() => logger.info('mongoDB connected'));

        return resolve(mongoose.connection);
    });
};