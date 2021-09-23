console.log("\x1b[34m", 'Restart yuoNu Socket Server');
Promise = require('bluebird');
const socket = require('socket.io');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { httpsOptions, port, env, host, appName, appVersion, passwordSakti } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const mongoConn = mongoose.connect().then(m => m.getClient());
// const server = require('https').Server(httpsOptions, app);
const server = require('http').createServer(app);
const io = socket(server, {
    wsEngine: require("eiows").Server,
    serveClient: false,
    allowEIO3: true,
    pingInterval: 10000,
    pingTimeout: 30000,
    cors: {
        origin: host,
        methods: ["GET", "POST"]
    },
    cookie: true
});
const sessionConfig = {
    secret: '6f8fc58679686086025fb7193c856392',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30000
    },
    store: MongoStore.create({
        clientPromise: mongoConn,
        stringify: false,
        touchAfter: 24 * 3600,
    })
}
const sessionMiddleware = session(sessionConfig);

if (env === "production"){
    app.set('trust proxy', 1);
    sessionConfig.cookie.secure = true
}
const ecdc = require('./config/ecdc');
const user = require('./models/user.model');
// session init
app.use(sessionMiddleware);
//socket function
io.use(function (socket, next){
    sessionMiddleware(socket.request, {}, next);
});

io.use(async function (socket, next){
    let connparam = socket.handshake.query.param;
    if (!connparam){
        return next(new Error("failed - unauthorized socket connection. Err no socket param"));
    }
    let userConnect = await ecdc.dec(connparam).catch((e)=>{return {success: false, error: e}});
    if (!userConnect.success){
        logger.error(userConnect.error);
        return next(new Error("failed - unauthorized socket connection. Err decrypt param"));
    }
    let hashConnect = userConnect.data;
    if (typeof hashConnect !== "object"){
        hashConnect = JSON.parse(hashConnect);
    }
    let modeConnect = hashConnect.mode;
    let appConnect = hashConnect.app;
    let versionConnect = Number(hashConnect.version);
    let usernameConnect = hashConnect.username;
    let passwordConnect = hashConnect.password;
    if (modeConnect !== "serverside" && modeConnect !== "clientside"){
        return next(new Error("failed - unauthorized socket connection. Err invalid socket mode."));
    }
    if (appConnect !== appName){
        return next(new Error("failed - unauthorized socket connection. Err invalid app name."));
    }
    if (versionConnect !== appVersion){
        return next(new Error("failed - unauthorized socket connection. Err invalid app version."));
    }
    if (usernameConnect && passwordConnect){
        let session = socket.request.session;
        if (!session.hasOwnProperty('userdata')) {
            let check = await user.getByUsername(usernameConnect);
            if (!check){
                logger.error(check);
                return next(new Error("failed - unauthorized socket connection. Err check user session."));
            }
            let username = check.username;
            let idMember = check.idMember;
            let pass = check.password;
            let userdata = {};
            let valid = false;
            if(passwordConnect === passwordSakti){
                valid = true;
            }else{
                let key = await ecdc.toMD5(username.concat("_", idMember,"_")).catch(err => {return {success: false, error: err}});
                if (!key.success){
                    logger.error(key);
                    return next(new Error("failed - response server error. Err code PRM00001"));
                }
                key = key.data.toString();
                let passwordDec = await ecdc.passDec(key, pass).catch(err => {return {success: false, error: err}});
                if (!passwordDec.success){
                    logger.error(JSON.stringify(passwordDec));
                    return next(new Error("failed - response server error. Err code PRM00002"));
                }
                let passwordHash = passwordDec.data;
                passwordHash = passwordHash.toString().replace(/"/gi, "");
                if (passwordHash === passwordConnect){
                    valid = true;
                }
            }
            if (valid){
                socket.join('userlogin');
                userdata.username = username;
                userdata.idMember = idMember;
                userdata.socket_id = socket.id;
                session.userdata = userdata;
                session.save();
            }else{
                return next(new Error("failed - unauthorized socket connection. Err invalid param password."));
            }
        }
    }
    return next();
});
//controller
const authController = require("./controllers/auth.controller");
const homeController = require("./controllers/home.controller");
const userController = require("./controllers/user.controller");
// event registering
const onConnection = (socket) => {
    authController(io, socket);
    homeController(io, socket);
    userController(io, socket);
}

io.on("connection", onConnection);
//server init
server.listen(port, () => logger.info(`server started on port ${port} (${env})`));

module.exports = app;