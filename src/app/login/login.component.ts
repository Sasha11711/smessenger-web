import { Component, OnDestroy } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnDestroy {
  protected errorMessage?: string;
  protected loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onSubmit() {
    this.loginForm.disable();
    this.errorMessage = undefined;
    const {login, password} = this.loginForm.value;
    this.authService.login(login!, password!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.loginForm.enable();
          this.errorMessage = error;
        }
      });
  }
}
