import { EventDispatcher } from '../../entities/Utils';
import Object3D from '../../entities/Scene3D/Object3D';
import ServerSocketService, { ClientSocketServiceEvents } from '../VirtualRoom/ServerSocketService';

export type Scene3DClientSocketServiceEvents = ClientSocketServiceEvents & { 
    sceneUpdate: Object3D[],
};

/**
 * WebSocket Singleton service for using Scene3D virtualRoom from the client side
 *
 * @remarks
 * need to be initialize with {@link ServerSocketService.InitConnection}
 */
export class Scene3DServerSocketService extends ServerSocketService {
    protected static override dispatcher: EventDispatcher<Scene3DClientSocketServiceEvents> = super.dispatcher;
    
    /*== Dispatcher deleguate ==*/
    static addEventListener = this.dispatcher.addEventListener.bind(this.dispatcher);
    static removeEventListener = this.dispatcher.removeEventListener.bind(this.dispatcher);
    static emit = this.dispatcher.emit.bind(this.dispatcher);
    /*== ==================== ==*/

    /**
     * Link the different listener to the right ws emit message
     * @virtual
     */
    protected static override LinkListener(){
        super.LinkListener();
        this.addEventListener('connect', () => {
            ServerSocketService.Connection.on('updateScene', (data: Object3D[]) => {
                this.emit('sceneUpdate', data);
            });
        });
    }
}

export default Scene3DServerSocketService;
