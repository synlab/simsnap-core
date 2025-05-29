import { User } from "../VirtualRoom/User";
import { UserInteractionPointerEventOnCanvas } from "./types";
import { ViewBoxEntity } from "./ViewBoxEntity";

export class CanvasUser extends User implements ViewBoxEntity {
    override currentPressStart: UserInteractionPointerEventOnCanvas | null = null;
    override currentPress: UserInteractionPointerEventOnCanvas | null = null;

    constructor(
        public pos?: {x: number, y: number},
        size?: {width: number, height: number},
        metaData?: { [key: string]: any },
        preId: string = 'canvaUser'
    ) {
        super(size, metaData, preId);
    }
}

export default CanvasUser;