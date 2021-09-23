const {host} = require('./vars');
let connection = null;

class Socket {
    constructor() {
        this._socket = null;
    }

    connect(server,sessionMiddleware) {
        const io = require('socket.io')(server, {
            serveClient: true,
            allowEIO3: true,
            pingInterval: 10000,
            pingTimeout: 30000,
            cors: {
                origin: host,
                methods: ["GET", "POST"]
            },
            cookie: true
        });

        io.use(function(socket, next) {
            sessionMiddleware(socket.request, socket.request.res, next);
        });

        io.on('connection', (socket) => {
            this._socket = socket;
            this._socket.on('statusConnetion',(data)=>{
                console.log(data)
            });

            this._socket.on('disconnect', function () {
                console.log(socket.id,"Un socket se desconecto");
            });

            console.log(`New socket connection: ${socket.id}`);
        });
    }

    sendEvent(event, data) {
        this._socket.emit(event, data);
    }

    registerEvent(event, handler) {
        this._socket.on(event, handler);
    }

    static init(server,sessionMiddleware) {
        if(!connection) {
            connection = new Socket();
            connection.connect(server,sessionMiddleware);
        }
    }

    static getConnection() {
        if(!connection) {
            throw new Error("no active connection");
        }
        return connection;
    }
}

module.exports = {
    connect: Socket.init,
    connection: Socket.getConnection
}