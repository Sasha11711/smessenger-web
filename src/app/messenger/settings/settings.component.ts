import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserDto } from "../../../dto/user/user-dto";
import { AuthService } from "../../../services/auth.service";
import { Subject, takeUntil } from "rxjs";
import { HttpUserService } from "../../../services/http-user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["../tabbing.scss"]
})
export class SettingsComponent implements OnInit, OnDestroy {
  protected tab = 0;
  protected user?: UserDto;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private httpUserService: HttpUserService, private router: Router) {
    const queryParams = this.router.parseUrl(this.router.url).queryParamMap;
    if (queryParams.has("tab")) this.tab = parseInt(queryParams.get("tab")!);
    else this.router.navigate([], {queryParams: {tab: 0}});
  }

  ngOnInit() {
    this.getUser();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected openTab(tab: number) {
    this.tab = tab;
    this.router.navigate([], {queryParams: {tab: tab}});
  }

  private getUser() {
    const token = this.authService.getToken();
    this.httpUserService.getFull(token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: UserDto) => this.user = user,
        error: (err) => {
          if (err.status === 401) this.authService.logout();
        }
      });
  }
}
