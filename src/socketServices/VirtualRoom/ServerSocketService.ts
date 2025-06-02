import { io, Socket } from 'socket.io-client'

/**
 * WebSocket Singleton service for using virtualRoom from the client side
 *
 * @remarks
 * need to be initialize with {@link ServerSocketService.InitConnection}
 */
export class ServerSocketService {
    /* The current socket connection to the server */
    static Connection: Socket;

    protected constructor() { }

    /**
     * Initialize the connection
     *
     * @param ip - the socket adress of the server
     * @param port - the socket port adress of the server
     * @param clientWidth - the width of the device
     * @param clientHeight - the height of the device
     * @param https - the http protocole to use (default to http)
     */
    static InitConnection(ip = 'localhost', port = 4000, clientWidth: number, clientHeight: number, https = false) {
        if (!ServerSocketService.Connection) {
            ServerSocketService.Connection = io(`${https ? 'https' : 'http'}://${ip}:${port}`, { ...(https ? { secure: true } : {})});
            console.log(`🔌 Connecting to server at ${https ? 'https' : 'http'}://${ip}:${port}`);
            
            ServerSocketService.Connection.on('connect', () => {
                this.handleConnection(clientWidth, clientHeight);
                
                this.onConnect?.();
            });
        }
    }

    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/


    /**
     * Send the required data to the server to init the Server-side's Client
     * @virtual
     */
    static handleConnection(clientWidth: number, clientHeight: number) {
        console.log('🔌 Connected to server')
        ServerSocketService.Connection.emit('clientSize', {
            width: clientWidth,
            height: clientHeight
        })
    }

    /**
     * Close the connection
     * @virtual
     */
    static handleCloseConnection() {
        ServerSocketService.Connection.close();
    }

    /**
     * Handle a press pointer by a device
     * @virtual
     *
     * @param x - the x position of the event
     * @param y - the y position of the event
     */
    public static handleDevicePress(x: number, y: number) {
        ServerSocketService.Connection.emit('devicePress', { x, y });
    }

    /**
     * Handle a move pointer by a device
     * @virtual
     *
     * @param x - the x position of the event
     * @param y - the y position of the event
     */
    public static handleDeviceMove(x: number, y: number) {
        ServerSocketService.Connection.emit('deviceMove', { x, y });
    }

    /**
     * Handle a release pointer by a device
     * @virtual
     *
     * @param x - the x position of the event
     * @param y - the y position of the event
     */
    public static handleDeviceRelease(x: number, y: number) {
        ServerSocketService.Connection.emit('deviceRelease', { x, y });
    }

    /**
     * Handle a change of the device orientation
     * @virtual
     *
     * @param alpha
     * @param beta
     * @param gamma
     */
    public static handleDeviceOrientationChange(alpha: number, beta: number, gamma: number) {
        ServerSocketService.Connection.emit('deviceOrientationChange', { alpha, beta, gamma });
    }

    
    /*=============================================================================================*/
    /*                                      event listenner                                        */
    /*=============================================================================================*/


    /**
     * CallBack triggered when a the connection is established
     * @eventProperty
     */
    static onConnect?: () => void;
}

export default ServerSocketService;