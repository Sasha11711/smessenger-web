import { Component, Input, OnDestroy } from "@angular/core";
import { UserDto } from "../../../../dto/user/user-dto";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { HttpUserService } from "../../../../services/http-user.service";
import { AuthService } from "../../../../services/auth.service";
import { PASSWORD_REGEX } from "../../../constants";
import { confirmPasswordValidator } from "../../../register/register.component";

@Component({
  selector: "app-security-user",
  templateUrl: "./security-user.component.html"
})
export class SecurityUserComponent implements OnDestroy {
  @Input() user!: UserDto;
  securityForm = new FormGroup({
    login: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required)
  });
  newPasswordForm = new FormGroup({
    password: new FormControl<string>('', [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
    confirmPassword: new FormControl<string>('')
  }, confirmPasswordValidator);
  private destroy$ = new Subject<void>();

  constructor(private httpUserService: HttpUserService, private authService: AuthService) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
  }

  resetUuid() {
    this.newPasswordForm.disable();
    this.securityForm.disable();
    const token = this.authService.getToken();
    this.httpUserService.resetUuid(token).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.authService.logout(),
        error: (err) => {
          if (err.status === 401) this.authService.logout();
          else {
            this.securityForm.enable();
            this.newPasswordForm.enable();
          }
        }
      });
  }

  deactivateUser() {
    this.newPasswordForm.disable();
    this.securityForm.disable();
    const token = this.authService.getToken();
    this.httpUserService.delete(
      token,
      this.securityForm.get("login")!.value!,
      this.securityForm.get("password")!.value!
    ).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.authService.logout(),
        error: (err) => {
          if (err.status === 401) this.authService.logout();
          else {
            this.securityForm.enable();
            this.newPasswordForm.enable();
          }
        }
      });
  }

  changePassword() {
    this.newPasswordForm.disable();
    this.securityForm.disable();
    const token = this.authService.getToken();
    this.httpUserService.changePassword(
      token,
      this.securityForm.get("login")!.value!,
      this.securityForm.get("password")!.value!,
      this.newPasswordForm.get("password")!.value!
    ).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.securityForm.reset();
          this.newPasswordForm.reset();
          this.securityForm.enable();
          this.newPasswordForm.enable();
        },
        error: (err) => {
          if (err.status === 401) this.authService.logout();
          else {
            this.securityForm.enable();
            this.newPasswordForm.enable();
          }
        }
      });
  }
}
