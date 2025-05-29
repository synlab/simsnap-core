import { Socket } from "socket.io";
import ClientSocketService from "../VirtualRoom/ClientSocketService";
import { InfiniteCanvas } from "../../entities/InfiniteCanvas/InfiniteCanvas";
import CanvasUser from "../../entities/InfiniteCanvas/CanvasUser";

export class CanvasClientSocketService extends ClientSocketService {
    private timeInterval: NodeJS.Timeout | undefined;

    constructor(
        clientSocket: Socket,
        override readonly virtualRoom: InfiniteCanvas,
        override readonly user: CanvasUser = new CanvasUser())
    {
        super(clientSocket, virtualRoom, user);

        this.timeInterval = setInterval(() => {
            if (this.user) {
                const viewPortScene = this.virtualRoom.getViewPortScene(this.user);
                this.clientSocket.emit('viewPortScene', viewPortScene);
            }
        }, 50)
    }

    override disconnected() {
        clearInterval(this.timeInterval);
    }
}

export default CanvasClientSocketService;