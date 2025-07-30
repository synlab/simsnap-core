import { io, Socket } from 'socket.io-client';
import { EventDispatcher } from 'src/entities/Utils';

export type ClientSocketServiceEvents = {
    connect: undefined;
    clientSize: { width: number, height: number }
    pointerPress: { x: number, y: number };
    pointerMove: { x: number, y: number };
    pointerRelease: { x: number, y: number };
    orientationChange: { alpha: number, beta: number, gamma: number } 
    destroy: undefined;
};

/**
 * WebSocket Singleton service for using virtualRoom from the client side
 *
 * @remarks
 * need to be initialize with {@link ServerSocketService.InitConnection}
 */
export class ServerSocketService {
    protected static dispatcher = new EventDispatcher<ClientSocketServiceEvents>();

    /*== Dispatcher deleguate ==*/
    static addEventListener = this.dispatcher.addEventListener.bind(this.dispatcher);
    static removeEventListener = this.dispatcher.removeEventListener.bind(this.dispatcher);
    static emit = this.dispatcher.emit.bind(this.dispatcher);
    /*== ==================== ==*/
    
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
    static InitConnection(roomCode: string, ip = 'localhost', port = 4000, clientWidth: number, clientHeight: number, https = false) {
        if (!ServerSocketService.Connection) {
            this.LinkListener();
            ServerSocketService.Connection = io(`${https ? 'https' : 'http'}://${ip}:${port}?room=${roomCode}`, { ...(https ? { secure: true } : {}) });
            console.log(`🔌 Connecting to server at ${https ? 'https' : 'http'}://${ip}:${port}?room=${roomCode}`);
            
            ServerSocketService.Connection.on('connect', () => {
                this.emit('connect', undefined);
                this.emit('clientSize', {
                    width: clientWidth,
                    height: clientHeight,
                });
            });
        }
    }

    /**
     * Link the different listener to the right ws emit message
     * @virtual
     */
    protected static LinkListener(){
        ServerSocketService.addEventListener('connect', () => console.log('🔌 Connected to server'));
        ServerSocketService.addEventListener('clientSize', (event) => {this.Connection.emit('clientSize', event);});
        ServerSocketService.addEventListener('pointerPress', (event) => this.Connection.emit('devicePress', event));
        ServerSocketService.addEventListener('pointerMove', (event) => this.Connection.emit('deviceMove', event));
        ServerSocketService.addEventListener('pointerRelease', (event) => this.Connection.emit('deviceRelease', event));
        ServerSocketService.addEventListener('orientationChange', (event) => this.Connection.emit('deviceOrientationChange', event));
        ServerSocketService.addEventListener('destroy', () => {
            this.Connection.removeAllListeners();
            this.Connection.close();
        });
    }
}

export default ServerSocketService;
