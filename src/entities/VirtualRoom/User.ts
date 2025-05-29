import { Position, UserInteractionPointerEvent } from "./types";

export class User {
    private static CountId = 0;
    readonly id: string;

    currentPressStart: UserInteractionPointerEvent | null = null;
    currentPress: UserInteractionPointerEvent | null = null;

    snapUsers: [User, Position][] = [];

    constructor(
        private _size?: { width: number; height: number; },
        public metaData?: { [key: string]: any },
        preId: string = 'user',
    ) {
        this.id = `${preId}-${User.CountId++}`;
    }

    set size(value: { width: number; height: number; }) { this._size = value };
    get size(): { width: number; height: number; } | undefined { return this._size; }

    /** @internal **/
    snapTo(user: User, position: Position) {
        this.snapUsers.push([user, position]);
        this.onSnap?.(user, position);
    }

    /** @internal **/
    unSnapTo(user: User, position: Position) {
        this.snapUsers = this.snapUsers.filter(el => ! (el[0] === user && el[1] === position));
        this.onUnSnap?.(user, position);
    }

    /*== handler ==*/

    handlePress(event: UserInteractionPointerEvent){
        this.currentPressStart = this.currentPress = event;
    }
    
    handleMove(event: UserInteractionPointerEvent) {
        if (this.currentPress) this.currentPress = event;
    }
    
    handleRelease(event: UserInteractionPointerEvent){
        this.currentPressStart = null;
        this.currentPress = null;
    }

    /*== ======= ==*/

    /*== event listenner ==*/

    onSnap?: (user: User, position: Position) => void;
    onUnSnap?: (user: User, position: Position) => void;

    /*== =============== ==*/
}

export default User;