import { Socket } from "socket.io";
import { User } from "../../entities/VirtualRoom/User";
import { VirtualRoom } from "../../entities/VirtualRoom/VirtualRoom";

export class ClientSocketService {

    constructor(public readonly clientSocket: Socket, public readonly virtualRoom: VirtualRoom, public readonly user: User = new User()) {
        console.log('✅ New client connected')

        virtualRoom.handleAddUser(user);
        
        clientSocket.on('clientSize', (data: {width: number, height: number}) => {
            this.user.size = data;
        })

        clientSocket.on('userPress', (data: {x: number, y: number}) => {
            this.virtualRoom.handleUserPress({user : this.user, x: data.x, y: data.y});
        })
    
        clientSocket.on('userMove', (data: {x: number, y: number}) => {
            this.virtualRoom.handleUserMove({user : this.user, x: data.x, y: data.y});
        })

        clientSocket.on('userRelease', (data: {x: number, y: number}) => {
            this.virtualRoom.handleUserRelease({user : this.user, x: data.x, y: data.y});
        })

        clientSocket.on('userOrientationChange', (data: {alpha: number, beta: number, gamma: number}) => {
            this.virtualRoom.handleUserOrientationChange({user : this.user, alpha: data.alpha, beta: data.beta, gamma: data.gamma});
        })
    
        clientSocket.on('disconnect', () => {
            this.virtualRoom.handleRemoveUser(this.user);
            this.disconnected();
            this.onDisconnect?.();
            console.log('❌ Client disconnected')
        })
    }

    /* for overriding */
    disconnected() {}

    /*== event listenner ==*/

    onDisconnect?: () => void;

    /*== =============== ==*/
}

export default ClientSocketService;