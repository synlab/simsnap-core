import { EventDispatcher } from '../../entities/VirtualRoom/EventDispatcher';
import { ViewBoxObject } from '../../entities/InfiniteCanvas/ViewBoxObject';
import ServerSocketService, { ClientSocketServiceEvents } from '../VirtualRoom/ServerSocketService';

export type InfiniteCanvasClientSocketServiceEvents = ClientSocketServiceEvents & { 
    sceneUpdate: ViewBoxObject[],
};

/**
 * WebSocket Singleton service for using InfiniteCanvas virtualRoom from the client side
 *
 * @remarks
 * need to be initialize with {@link ServerSocketService.InitConnection}
 */
export class CanvasServerSocketService extends ServerSocketService {

    /*== Dispatcher deleguate ==*/
    static addEventListener = (this.dispatcher as EventDispatcher<InfiniteCanvasClientSocketServiceEvents>).addEventListener.bind(this.dispatcher);
    static removeEventListener = (this.dispatcher as EventDispatcher<InfiniteCanvasClientSocketServiceEvents>).removeEventListener.bind(this.dispatcher);
    static emit = (this.dispatcher as EventDispatcher<InfiniteCanvasClientSocketServiceEvents>).emit.bind(this.dispatcher);
    /*== ==================== ==*/

    /**
     * Link the different listener to the right ws emit message
     * @virtual
     */
    protected static override LinkListener(){
        super.LinkListener();
        this.addEventListener("connect", ()=>{
            ServerSocketService.Connection.on('updateScene', (data: ViewBoxObject[]) => {
                this.emit("sceneUpdate", data)
            })
        });
    }
}

export default CanvasServerSocketService;