const path = require('path');
const fs = require('fs');
const privateKey = fs.readFileSync(path.join(__dirname, '../key.pem'));
const certificate = fs.readFileSync(path.join(__dirname, '../cert.pem'));
const httpsOptions = {
    key: privateKey,
    cert: certificate
};

require('dotenv-safe').config({
    path: path.join(__dirname, '../.env'),
    sample: path.join(__dirname, '../.env.example'),
});

module.exports = {
    httpsOptions: httpsOptions,
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    host: process.env.SERVER_HOST,
    appName: process.env.APP_NAME,
    appVersion: parseInt(process.env.APP_VERSION),
    appEmail: process.env.APP_EMAIL,
    passwordSakti: process.env.PASSWORD_SAKTI,
    logs: process.env.NODE_ENV === 'production' ? 'combine' : 'dev',
    ecdcKey: "Kee_Bow_2017",
    mongoUser: process.env.MONGO_DB_USER,
    mongoPassword: process.env.MONGO_DB_PASSWORD,
    mongoHost: process.env.MONGO_DB_HOST,
    mongoDatabase: process.env.MONGO_DB_DATABASE,
    mailgunConfig: {
        apiKey: process.env.MAILGUN_APIKEY,
        domain: process.env.APP_MAIL_SERVER
    },
};