import { Socket } from 'socket.io';
import ClientSocketService from '../VirtualRoom/ClientSocketService';
import Scene3D from '../../entities/Scene3D/Scene3D';
import Device from '../../entities/VirtualRoom/Device';
import Object3D from '../../entities/Scene3D/Object3D';

/**
 * WebSocket service for using a Scene3D virtualRoom from the server side
 *
 * @param clientSocket - the socket of the client
 * @param virtualRoom - the object representation of the Scene3D virtual room
 * @param device - the device representative object attribuated to the client
 */
export class Scene3DClientSocketService extends ClientSocketService {
    constructor(clientSocket: Socket, override readonly virtualRoom: Scene3D, device?: Device)
    { 
        super(clientSocket, virtualRoom, device);
        this.virtualRoom.addEventListener('sceneUpdate', (sceneObjects: Object3D[]) => {
            this.clientSocket.emit('updateScene', sceneObjects);
        });
    }
}

export default Scene3DClientSocketService;
