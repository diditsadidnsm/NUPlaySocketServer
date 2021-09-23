const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
// env variable
const {logs, host} = require('./vars');
//server init
const app = express();

app.use(morgan(logs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());
app.use(helmet());
app.use(cors());

app.use('/', (req, res)=>{res.send("ok")});

app.use(function (err, req, res, next) {
    res.status(404).json({message: "Not found"});
});

module.exports = app;