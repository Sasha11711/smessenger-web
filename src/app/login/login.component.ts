import { Component, OnDestroy } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnDestroy {
  errorMessage?: string;
  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.loginForm.disable();
    this.errorMessage = undefined;
    this.authService.login(this.getValue("login"), this.getValue("password"))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          this.loginForm.enable();
          this.errorMessage = err;
        }
      });
  }

  private getValue(controlName: string) {
    return this.loginForm.get(controlName)!.value;
  }
}
