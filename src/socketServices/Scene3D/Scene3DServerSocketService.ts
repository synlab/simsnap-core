import Object3D from '../../entities/Scene3D/Object3D';
import ServerSocketService from '../VirtualRoom/ServerSocketService';

export class Scene3DServerSocketService extends ServerSocketService {

    static override connected() {
        ServerSocketService.Connection.on('updateScene', (data: Object3D[]) => {
            this.onSceneUpdate?.(data);
        })
    }

    /*== event listenner ==*/

    static onSceneUpdate?: (data: Object3D[]) => void;

    /*== =============== ==*/
}

export default Scene3DServerSocketService;