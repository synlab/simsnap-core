import { InfiniteCanvas } from '../../entities/InfiniteCanvas/InfiniteCanvas';
import { ViewBoxObject } from '../../entities/InfiniteCanvas/ViewBoxObject';
import ServerSocketService from '../VirtualRoom/ServerSocketService';

/**
 * WebSocket Singleton service for using InfiniteCanvas virtualRoom from the client side
 *
 * @remarks
 * need to be initialize with {@link ServerSocketService.InitConnection}
 */
export class CanvasServerSocketService extends ServerSocketService {

    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/


    /**
     * Link update scene to the listener
     * @override
     */
    static override handleConnection(clientWidth: number, clientHeight: number) {
        ServerSocketService.Connection.on('updateScene', (data: ViewBoxObject[]) => {
            this.onSceneUpdate?.(data);
        })
        super.handleConnection(clientWidth, clientHeight);
    }

    
    /*=============================================================================================*/
    /*                                      event listenner                                        */
    /*=============================================================================================*/


    /**
     * CallBack transfering the scene fresh update
     * @eventProperty
     * 
     * @see {@link InfiniteCanvas.onSceneUpdate}
     */
    static onSceneUpdate?: (data: ViewBoxObject[]) => void;
}

export default CanvasServerSocketService;