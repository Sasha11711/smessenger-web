import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { UserDto } from "../../../../dto/user/user-dto";
import { ChatDto } from "../../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../../dto/user/user-info-dto";
import { ContextButton, ContextMenuComponent } from "../../context-menu/context-menu.component";
import { ContextMenuService } from "../../../../services/context-menu.service";
import { Subject, takeUntil } from "rxjs";
import { AuthService } from "../../../../services/auth.service";
import { HttpChatService } from "../../../../services/http-chat.service";
import { UsersService } from "../../../../services/users.service";

@Component({
  selector: "app-chat-settings",
  templateUrl: "./chat-settings.component.html",
  styleUrls: ["../../tabbing.scss"]
})
export class ChatSettingsComponent implements OnDestroy {
  @Input() user!: UserDto;
  @Input() chat!: ChatDto;
  @Output() onSettingsToggled = new EventEmitter();
  contextMenuComponent?: ContextMenuComponent;
  tab = 0;
  private destroy$ = new Subject<void>();

  constructor(private usersService: UsersService, private httpChatService: HttpChatService, private authService: AuthService, contextMenuService: ContextMenuService) {
    contextMenuService.subject
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.disableContextMenu());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFriends(): UserInfoDto[] {
    return this.chat.users.filter(user =>
      !this.chat.users.find(value => value.id === user.id) &&
      !this.chat.bannedUsers.find(value => value.id === user.id)
    );
  }

  unban(userId: number) {
    let token = this.authService.getToken();
    this.httpChatService.unbanUserByMod(this.chat.id, userId, token).subscribe({
      next: () => {
        this.chat.bannedUsers.splice(this.chat.bannedUsers.findIndex(value => value.id !== userId), 1);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  ban(user: UserInfoDto) {
    let token = this.authService.getToken();
    this.httpChatService.banUserByMod(this.chat.id, user.id, token).subscribe({
      next: () => {
        this.chat.bannedUsers.push(user);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  kick(userId: number) {
    let token = this.authService.getToken();
    this.httpChatService.kickUserByMod(this.chat.id, userId, token).subscribe({
      next: () => {
        this.chat.users.splice(this.chat.users.findIndex(value => value.id !== userId), 1);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  unmod(userId: number) {
    let token = this.authService.getToken();
    this.httpChatService.unsetModeratorByMod(this.chat.id, userId, token).subscribe({
      next: () => {
        this.chat.moderatorsId.splice(this.chat.moderatorsId.indexOf(userId), 1);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  mod(user: UserInfoDto) {
    let token = this.authService.getToken();
    this.httpChatService.setModeratorByMod(this.chat.id, user.id, token).subscribe({
      next: () => {
        this.chat.moderatorsId.push(user.id);
      },
      error: (err) => {
        // TODO: handle error
      }
    });
  }

  enableContextMenu(event: MouseEvent, chatUser: UserInfoDto) {
    if (!this.contextMenuComponent && this.user.id !== chatUser.id) {
      event.preventDefault();
      this.contextMenuComponent = new ContextMenuComponent();
      this.contextMenuComponent.buttons = this.usersService.userContextMenu(this.user, chatUser);
      if (this.chat.bannedUsers.find(value => value.id === chatUser.id)) {
        let unbanSubject = new Subject<void>();
        unbanSubject.subscribe(() => this.unban(chatUser.id));
        this.contextMenuComponent.buttons.push(new ContextButton("Unban", unbanSubject));
      } else {
        let banSubject = new Subject<void>();
        banSubject.subscribe(() => this.ban(chatUser));
        this.contextMenuComponent.buttons.push(new ContextButton("Ban", banSubject));
        if (this.chat.users.find(value => value.id === chatUser.id)) {
          let kickSubject = new Subject<void>();
          kickSubject.subscribe(() => this.kick(chatUser.id));
          this.contextMenuComponent.buttons.push(new ContextButton("Kick", kickSubject));
          if (this.chat.moderatorsId.includes(chatUser.id)) {
            let unmodSubject = new Subject<void>();
            unmodSubject.subscribe(() => this.unmod(chatUser.id));
            this.contextMenuComponent.buttons.push(new ContextButton("Unmod", unmodSubject));
          } else {
            let modSubject = new Subject<void>();
            modSubject.subscribe(() => this.mod(chatUser));
            this.contextMenuComponent.buttons.push(new ContextButton("Mod", modSubject));
          }
        }
      }
      this.contextMenuComponent.title = `${chatUser.id}. ${chatUser.username}`;
      this.contextMenuComponent.x = event.clientX;
      this.contextMenuComponent.y = event.clientY;
    }
  }

  disableContextMenu() {
    this.contextMenuComponent = undefined;
  }
}
