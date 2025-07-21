import { Server, Socket } from 'socket.io';
import { VirtualRoom } from '../../entities/VirtualRoom/VirtualRoom';
import { EventDispatcher } from '../../entities/VirtualRoom/EventDispatcher';
import ClientSocketService from './ClientSocketService';

export type RoomSocketServiceEvents = {
  destroy: undefined;
};

/**
 * WebSocket service for using virtualRoom from the server side
 *
 * @param clientSocket - the socket of the client
 * @param virtualRoom - the object representation of the virtual room
 * @param device - the device representative object attribuated to the client
 */
export class RoomSocketService<Client extends ClientSocketService = ClientSocketService, Events extends RoomSocketServiceEvents = RoomSocketServiceEvents> {
    private dispatcher = new EventDispatcher<Events>();

    constructor(
        protected roomCode: string,
        protected ioServer: Server,
        public virtualRoom: VirtualRoom = new VirtualRoom(),
        public clientFactory: (clientSocket: Socket) => Client,
    ) {
        this.addEventListener('destroy', this.destroy.bind(this));
    }

    /*== Dispatcher deleguate ==*/
    public addEventListener = this.dispatcher.addEventListener.bind(this.dispatcher);
    public removeEventListener = this.dispatcher.removeEventListener.bind(this.dispatcher);
    public emit = this.dispatcher.emit.bind(this.dispatcher);
    /*== ==================== ==*/
    
    get ioRoom(){
        return this.ioServer.to(this.roomCode);
    }

    addNewClient(clientSocket: Socket): Client {
        clientSocket.join(this.roomCode);
        const client = this.clientFactory(clientSocket);
        return client;
    }

    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/

    /**
     * Handle the destroy of the current object
     */
    private destroy() {
        this.virtualRoom.emit('destroy', undefined);
        // this.ioRoom.disconnectSockets();
    }
}

export default RoomSocketService;
