import Scene3D from '../../entities/Scene3D/Scene3D';
import Object3D from '../../entities/Scene3D/Object3D';
import ServerSocketService from '../VirtualRoom/ServerSocketService';

export class Scene3DServerSocketService extends ServerSocketService {

    /*============================================================================================*/
    /*                                          handlers                                          */
    /*============================================================================================*/


    /**
     * Link update scene to the listener
     * @override
     */
    static override handleConnection(clientWidth: number, clientHeight: number) {
        ServerSocketService.Connection.on('updateScene', (data: Object3D[]) => {
            this.onSceneUpdate?.(data);
        })
        super.handleConnection(clientHeight, clientHeight);
    }


    /*=============================================================================================*/
    /*                                      event listenner                                        */
    /*=============================================================================================*/


    /**
     * CallBack transfering the scene fresh update
     * @eventProperty
     * 
     * @see {@link Scene3D.onSceneUpdate}
     */
    static onSceneUpdate?: (data: Object3D[]) => void;
}

export default Scene3DServerSocketService;