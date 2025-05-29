import { Socket } from "socket.io";
import ClientSocketService from "../VirtualRoom/ClientSocketService";
import { InfiniteCanvas } from "../../entities/InfiniteCanvas/InfiniteCanvas";
import CanvasDevice from "../../entities/InfiniteCanvas/CanvasDevice";

export class CanvasClientSocketService extends ClientSocketService {
    private timeInterval: NodeJS.Timeout | undefined;

    constructor(
        clientSocket: Socket,
        override readonly virtualRoom: InfiniteCanvas,
        override readonly device: CanvasDevice = new CanvasDevice())
    {
        super(clientSocket, virtualRoom, device);

        this.timeInterval = setInterval(() => {
            if (this.device) {
                const viewPortScene = this.virtualRoom.getViewPortScene(this.device);
                this.clientSocket.emit('viewPortScene', viewPortScene);
            }
        }, 50)
    }

    override disconnected() {
        clearInterval(this.timeInterval);
    }
}

export default CanvasClientSocketService;