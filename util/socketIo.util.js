import ioClient from 'socket.io-client';
import ioServer from 'socket.io';

export default class SocketIoUtil {
    static serverListenEvent(server, event, callback) {
        const socketIoServer = ioServer(server);
        socketIoServer.on('connection', function (socketServer) {
            socketServer.on(event, function () {
                callback.apply(arguments);
            });
        });
    }

    static emitEvent(url, event, callback) {
        if (!callback) {
            callback = function () {
                setTimeout(function () {
                    process.exit(0);
                }, 1000);
            };
        }

        const socketClient = ioClient.connect(url);
        socketClient.on('connect', function () {
            socketClient.emit(event);
            callback.apply(arguments);
        });
    }
}