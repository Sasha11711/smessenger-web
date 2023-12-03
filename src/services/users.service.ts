import { Injectable } from "@angular/core";
import { UserInfoDto } from "../dto/user/user-info-dto";
import { UserDto } from "../dto/user/user-dto";
import { ContextButton } from "../app/messenger/context-menu/context-menu.component";
import { Subject } from "rxjs";
import { HttpUserService } from "./http-user.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class UsersService {

  constructor(private httpUserService: HttpUserService, private authService: AuthService) { }

  unblock(user: UserDto, anotherUserId: number) {
    const token = this.authService.getToken();
    this.httpUserService.unblockUser(token, anotherUserId).subscribe({
      next: () => user!.blockedUsers.splice(user!.blockedUsers.findIndex(value => value.id !== anotherUserId), 1),
      error: this.handleError
    });
  }

  block(user: UserDto, anotherUser: UserInfoDto) {
    const token = this.authService.getToken();
    this.httpUserService.blockUser(token, anotherUser.id).subscribe({
      next: () => {
        user!.blockedUsers.push(anotherUser);
        user!.friends = user!.friends.filter(friend => friend.id !== anotherUser.id);
        user!.friendRequests = user!.friendRequests.filter(friendRequest => friendRequest.id !== anotherUser.id);
        user!.friendRequestedBy = user!.friendRequestedBy.filter(friendRequestedBy => friendRequestedBy.id !== anotherUser.id);
      },
      error: this.handleError
    });
  }

  removeFriend(user: UserDto, anotherUserId: number) {
    const token = this.authService.getToken();
    this.httpUserService.removeFriend(token, anotherUserId).subscribe({
      next: () => user!.friends.splice(user!.friends.findIndex(value => value.id !== anotherUserId), 1),
      error: this.handleError
    });
  }

  removeFriendRequest(user: UserDto, anotherUserId: number) {
    const token = this.authService.getToken();
    this.httpUserService.removeFriendRequest(token, anotherUserId).subscribe({
      next: () => user!.friendRequests.splice(user!.friendRequests.findIndex(value => value.id !== anotherUserId), 1),
      error: this.handleError
    });
  }

  declineFriendRequest(user: UserDto, anotherUserId: number) {
    const token = this.authService.getToken();
    this.httpUserService.declineFriendRequest(token, anotherUserId).subscribe({
      next: () => user!.friendRequestedBy.splice(user!.friendRequestedBy.findIndex(value => value.id !== anotherUserId), 1),
      error: this.handleError
    });
  }

  acceptFriendRequest(user: UserDto, anotherUser: UserInfoDto) {
    const token = this.authService.getToken();
    this.httpUserService.acceptFriendRequest(token, anotherUser.id).subscribe({
      next: () => {
        user!.friendRequestedBy.splice(user!.friendRequestedBy.findIndex(value => value.id !== anotherUser.id), 1);
        user!.friends.push(user);
      },
      error: this.handleError
    });
  }

  addFriendRequest(user: UserDto, anotherUser: UserInfoDto) {
    const token = this.authService.getToken();
    this.httpUserService.addFriendRequest(token, anotherUser.id).subscribe({
      next: () => user!.friendRequests.push(anotherUser),
      error: this.handleError
    });
  }

  userContextMenu(user: UserDto, anotherUser: UserInfoDto) {
    const buttons: ContextButton[] = [];
    if (user.blockedUsers.some(blockedUser => blockedUser.id === anotherUser.id)) {
      const unblockSubject = new Subject<void>();
      unblockSubject.subscribe(() => this.unblock(user, anotherUser.id));
      buttons.push(new ContextButton("Unblock", unblockSubject));
    } else {
      const blockSubject = new Subject<void>();
      blockSubject.subscribe(() => this.block(user, anotherUser));
      buttons.push(new ContextButton("Block", blockSubject));
      if (user.friends.some(friend => friend.id === anotherUser.id)) {
        const removeFriendSubject = new Subject<void>();
        removeFriendSubject.subscribe(() => this.removeFriend(user, anotherUser.id));
        buttons.push(new ContextButton("Remove friend", removeFriendSubject));
      } else if (user.friendRequests.some(friendRequest => friendRequest.id === anotherUser.id)) {
        const removeFriendRequestSubject = new Subject<void>();
        removeFriendRequestSubject.subscribe(() => this.removeFriendRequest(user, anotherUser.id));
        buttons.push(new ContextButton("Cancel friend request", removeFriendRequestSubject));
      } else if (user.friendRequestedBy.some(friendRequestedBy => friendRequestedBy.id === anotherUser.id)) {
        const acceptFriendRequestSubject = new Subject<void>();
        acceptFriendRequestSubject.subscribe(() => this.acceptFriendRequest(user, anotherUser));
        buttons.push(new ContextButton("Accept friend request", acceptFriendRequestSubject));
        const declineFriendRequestSubject = new Subject<void>();
        declineFriendRequestSubject.subscribe(() => this.declineFriendRequest(user, anotherUser.id));
        buttons.push(new ContextButton("Decline friend request", declineFriendRequestSubject));
      } else {
        const addFriendRequestSubject = new Subject<void>();
        addFriendRequestSubject.subscribe(() => this.addFriendRequest(user, anotherUser));
        buttons.push(new ContextButton("Send friend request", addFriendRequestSubject));
      }
    }
    return buttons;
  }

  private handleError(err: any) {
    if (err.status === 403) window.alert(err.message);
    if (err.status === 401) this.authService.logout();
  }
}
