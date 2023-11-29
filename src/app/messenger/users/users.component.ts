import { Component, OnInit } from "@angular/core";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { ContextMenuComponent } from "../context-menu/context-menu.component";
import { UserDto } from "../../../dto/user/user-dto";
import { AuthService } from "../../../services/auth.service";
import { HttpUserService } from "../../../services/http-user.service";
import { ContextMenuService } from "../../../services/context-menu.service";
import { UsersService } from "../../../services/users.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss", "../tabbing.scss"]
})
export class UsersComponent implements OnInit {
  contextMenuComponent?: ContextMenuComponent;
  user?: UserDto;
  tab = 0;

  constructor(private usersService: UsersService, private httpUserService: HttpUserService, private authService: AuthService, contextMenuService: ContextMenuService) {
    contextMenuService.subject.subscribe(() => this.disableContextMenu());
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    let token = this.authService.getToken();
    this.httpUserService.getFull(token).subscribe({
      next: (user: UserDto) => {
        if (JSON.stringify(this.user) != JSON.stringify(user))
          this.user = user;
      },
      error: (err) => {
        if (err.status === 401) this.authService.logout();
      }
    });
  }

  enableContextMenu(event: MouseEvent, chatUser: UserInfoDto) {
    if (!this.contextMenuComponent) {
      event.preventDefault();
      this.contextMenuComponent = new ContextMenuComponent();
      this.contextMenuComponent.buttons = this.usersService.userContextMenu(this.user!, chatUser);
      this.contextMenuComponent.title = `${chatUser.id}. ${chatUser.username}`;
      this.contextMenuComponent.x = event.clientX;
      this.contextMenuComponent.y = event.clientY;
    }
  }

  disableContextMenu() {
    this.contextMenuComponent = undefined;
  }
}
