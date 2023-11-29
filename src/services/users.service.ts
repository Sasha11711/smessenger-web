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
    let token = this.authService.getToken();
    this.httpUserService.unblockUser(token, anotherUserId).subscribe({
      next: () => {
        user!.blockedUsers.splice(user!.blockedUsers.findIndex(value => value.id !== anotherUserId), 1);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  block(user: UserDto, anotherUser: UserInfoDto) {
    let token = this.authService.getToken();
    this.httpUserService.blockUser(token, anotherUser.id).subscribe({
      next: () => {
        user!.blockedUsers.push(anotherUser);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  removeFriend(user: UserDto, anotherUserId: number) {
    let token = this.authService.getToken();
    this.httpUserService.removeFriend(token, anotherUserId).subscribe({
      next: () => {
        user!.friends.splice(user!.friends.findIndex(value => value.id !== anotherUserId), 1);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  removeFriendRequest(user: UserDto, anotherUserId: number) {
    let token = this.authService.getToken();
    this.httpUserService.removeFriendRequest(token, anotherUserId).subscribe({
      next: () => {
        user!.friendRequests.splice(user!.friendRequests.findIndex(value => value.id !== anotherUserId), 1);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  declineFriendRequest(user: UserDto, anotherUserId: number) {
    let token = this.authService.getToken();
    this.httpUserService.declineFriendRequest(token, anotherUserId).subscribe({
      next: () => {
        user!.friendRequestedBy.splice(user!.friendRequestedBy.findIndex(value => value.id !== anotherUserId), 1);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  acceptFriendRequest(user: UserDto, anotherUser: UserInfoDto) {
    let token = this.authService.getToken();
    this.httpUserService.acceptFriendRequest(token, anotherUser.id).subscribe({
      next: () => {
        user!.friendRequestedBy.splice(user!.friendRequestedBy.findIndex(value => value.id !== anotherUser.id), 1);
        user!.friends.push(user);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  addFriendRequest(user: UserDto, anotherUser: UserInfoDto) {
    let token = this.authService.getToken();
    this.httpUserService.acceptFriendRequest(token, anotherUser.id).subscribe({
      next: () => {
        user!.friendRequests.push(anotherUser);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  userContextMenu(user: UserDto, anotherUser: UserInfoDto) {
    let buttons: ContextButton[] = [];
    if (user.blockedUsers.find(blockedUser => blockedUser.id === anotherUser.id)) {
      let unblockSubject = new Subject<void>();
      unblockSubject.subscribe(() => this.unblock(user, anotherUser.id));
      buttons.push(new ContextButton("Unblock", unblockSubject));
    } else {
      let blockSubject = new Subject<void>();
      blockSubject.subscribe(() => this.block(user, anotherUser));
      buttons.push(new ContextButton("Block", blockSubject));
      if (user.friends.find(friend => friend.id === anotherUser.id)) {
        let removeFriendSubject = new Subject<void>();
        removeFriendSubject.subscribe(() => this.removeFriend(user, anotherUser.id));
        buttons.push(new ContextButton("Remove friend", removeFriendSubject));
      } else if (user.friendRequests.find(friendRequest => friendRequest.id === anotherUser.id)) {
        let removeFriendRequestSubject = new Subject<void>();
        removeFriendRequestSubject.subscribe(() => this.removeFriendRequest(user, anotherUser.id));
        buttons.push(new ContextButton("Cancel friend request", removeFriendRequestSubject));
      } else if (user.friendRequestedBy.find(friendRequestedBy => friendRequestedBy.id === anotherUser.id)) {
        let acceptFriendRequestSubject = new Subject<void>();
        acceptFriendRequestSubject.subscribe(() => this.acceptFriendRequest(user, anotherUser));
        buttons.push(new ContextButton("Accept friend request", acceptFriendRequestSubject));
        let declineFriendRequestSubject = new Subject<void>();
        declineFriendRequestSubject.subscribe(() => this.declineFriendRequest(user, anotherUser.id));
        buttons.push(new ContextButton("Decline friend request", declineFriendRequestSubject));
      } else {
        let addFriendRequestSubject = new Subject<void>();
        addFriendRequestSubject.subscribe(() => this.addFriendRequest(user, anotherUser));
        buttons.push(new ContextButton("Add friend request", addFriendRequestSubject));
      }
    }
    return buttons;
  }
}
