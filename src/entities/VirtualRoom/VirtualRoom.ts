import { UserInteractionOrientationEvent, UserInteractionPointerEvent } from "./types";
import { User } from "../VirtualRoom/User";
import { removeItem } from "../Utils";
import { SnapManager } from "./SnapManager";

export class VirtualRoom {
    private snapManager = new SnapManager(this);

    constructor(
        public users: User[] = [],
    ) { }

    /*== handler ==*/

    handleAddUser(user: User) {
        this.users.push(user);
        this.onAddUser?.(user);
    }

    handleRemoveUser(user: User) {
        removeItem(this.users, user);
        this.users.forEach(usr => usr.snapUsers = usr.snapUsers.filter(el => el[0] !== user));
        this.onRemoveUser?.(user);
    }

    handleUserPress(event: UserInteractionPointerEvent) {
        event.user.handlePress(event);
        this.onUserPress?.(event);
    }

    handleUserMove(event: UserInteractionPointerEvent) {
        if (event.user.currentPress) {
            event.user.handleMove(event);
            this.onUserMove?.(event);
        }
    }

    handleUserRelease(event: UserInteractionPointerEvent) {
        if (event.user.currentPress) {
            
            /*-- snap --*/
            this.snapManager.manageSnap(event);
            /*-- ---- --*/
            
            event.user.handleRelease(event);
            this.onUserRelease?.(event);
        }
    }

    handleUserOrientationChange(event: UserInteractionOrientationEvent) {
        this.onUserOrientationChange?.(event);
    }

    /*== ======= ==*/

    /*== event listenner ==*/

    onSnapUsers?: (event1: UserInteractionPointerEvent, event2: UserInteractionPointerEvent) => void;
    onUnSnapUsers?: (event1: UserInteractionPointerEvent, event2: UserInteractionPointerEvent) => void;
    onAddUser?: (user: User) => void;
    onRemoveUser?: (user: User) => void;
    onUserPress?: (event: UserInteractionPointerEvent) => void;
    onUserMove?: (event: UserInteractionPointerEvent) => void;
    onUserRelease?: (event: UserInteractionPointerEvent) => void;
    onUserOrientationChange?: (event: UserInteractionOrientationEvent) => void;

    /*== =============== ==*/
}