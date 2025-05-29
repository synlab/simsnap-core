import { io, Socket } from 'socket.io-client'

export class ServerSocketService {

    static Connection: Socket;

    protected constructor() { }

    static InitConnection(ip = 'localhost', port = 4000, clientWidth: number, clientHeight: number, https = false) {
        if (!ServerSocketService.Connection) {
            ServerSocketService.Connection = io(`${https ? 'https' : 'http'}://${ip}:${port}`, { ...(https ? { secure: true } : {})});
            console.log(`🔌 Connecting to server at ${https ? 'https' : 'http'}://${ip}:${port}`);
            
            ServerSocketService.Connection.on('connect', () => {
                console.log('🔌 Connected to server')

                ServerSocketService.Connection.emit('clientSize', {
                    width: clientWidth,
                    height: clientHeight
                })

                this.connected();
                
                this.onConnect?.();
            });
        }
    }

    /* for overriding */
    static connected() {
    }

    static closeConnection() {
        ServerSocketService.Connection.close();
    }

    /*== handler ==*/

    public static handleUserPress(x: number, y: number) {
        ServerSocketService.Connection.emit('userPress', { x, y });
    }

    public static handleUserMove(x: number, y: number) {
        ServerSocketService.Connection.emit('userMove', { x, y });
    }

    public static handleUserRelease(x: number, y: number) {
        ServerSocketService.Connection.emit('userRelease', { x, y });
    }

    public static handleUserOrientationChange(alpha: number, beta: number, gamma: number) {
        ServerSocketService.Connection.emit('userOrientationChange', { alpha, beta, gamma });
    }

    /*== ======= ==*/

    /*== event listenner ==*/

    static onConnect?: () => void;

    /*== =============== ==*/
}

export default ServerSocketService;