import { ViewBoxObject } from '../../entities/InfiniteCanvas/ViewBoxObject';
import ServerSocketService from '../VirtualRoom/ServerSocketService';

export class CanvasServerSocketService extends ServerSocketService {

    static override connected() {
        ServerSocketService.Connection.on('viewPortScene', (data: ViewBoxObject[]) => {
            this.onViewPortSceneUpdate?.(data);
        })
    }

    /*== event listenner ==*/

    static onViewPortSceneUpdate?: (data: ViewBoxObject[]) => void;

    /*== =============== ==*/
}

export default CanvasServerSocketService;