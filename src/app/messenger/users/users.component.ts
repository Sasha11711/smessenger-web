import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { ContextMenuComponent } from "../context-menu/context-menu.component";
import { UserDto } from "../../../dto/user/user-dto";
import { AuthService } from "../../../services/auth.service";
import { HttpUserService } from "../../../services/http-user.service";
import { ContextMenuService } from "../../../services/context-menu.service";
import { UsersService } from "../../../services/users.service";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss", "../tabbing.scss"]
})
export class UsersComponent implements OnInit, OnDestroy {
  user?: UserDto;
  isLoading = false;
  searchUsername = '';
  searchedUsers?: UserInfoDto[];
  tab = 0;
  contextMenuComponent?: ContextMenuComponent;
  private destroy$ = new Subject<void>();
  private searchDestroy$ = new Subject<void>();

  constructor(private usersService: UsersService, private httpUserService: HttpUserService, private authService: AuthService, private router: Router, contextMenuService: ContextMenuService) {
    contextMenuService.subject
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.disableContextMenu());
  }

  ngOnInit() {
    this.getUser();
    let queryParams = this.router.parseUrl(this.router.url).queryParamMap;
    if (queryParams.has("tab"))
      this.tab = parseInt(queryParams.get("tab")!);
    else this.router.navigate([], {queryParams: {tab: 0}});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchDestroy$.next();
    this.searchDestroy$.complete();
  }

  getUser() {
    this.isLoading = true;
    let token = this.authService.getToken();
    this.httpUserService.getFull(token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: UserDto) => {
          if (JSON.stringify(this.user) != JSON.stringify(user))
            this.user = user;
          this.isLoading = false;
        },
        error: (err) => {
          if (err.status === 401) this.authService.logout();
          this.isLoading = false;
        }
      });
  }

  searchUsers() {
    if (this.searchUsername.length > 1) {
      this.searchDestroy$.next();
      this.httpUserService.getAllByUsername(this.searchUsername)
        .pipe(takeUntil(this.searchDestroy$))
        .subscribe({
          next: (users: UserInfoDto[]) => {
            this.searchedUsers = users.filter(value => value.id !== this.user?.id);
          },
          error: (err) => {
            //TODO handle error
          }
        });
    }
  }

  openTab(tab: number) {
    this.getUser();
    this.tab = tab;
    this.router.navigate([], {queryParams: {tab: tab}});
  }

  enableContextMenu(event: MouseEvent, chatUser: UserInfoDto) {
    if (!this.contextMenuComponent) {
      event.preventDefault();
      this.contextMenuComponent = new ContextMenuComponent();
      this.contextMenuComponent.buttons = this.usersService.userContextMenu(this.user!, chatUser);
      this.contextMenuComponent.title = `${chatUser.id}. ${chatUser.username}`;
      this.contextMenuComponent.x = event.clientX;
      this.contextMenuComponent.y = event.clientY;
    } else this.disableContextMenu();
  }

  disableContextMenu() {
    this.contextMenuComponent = undefined;
  }
}
