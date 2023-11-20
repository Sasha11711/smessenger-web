import { Component, OnDestroy } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { LOGIN_PASSWORD_ERROR, LOGIN_REGEX, PASSWORD_REGEX, UNEXPECTED_ERROR, USER_CREATE_ERROR } from "../constants";
import { HttpUserService } from "../../services/http-user.service";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnDestroy {
  errorMessage?: string;
  registerForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.pattern(LOGIN_REGEX)]),
    password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
    confirmPassword: new FormControl(''),
    username: new FormControl('', Validators.required),
  }, this.confirmPasswordValidator);
  private destroy$ = new Subject<void>();

  constructor(private httpUserService: HttpUserService, private router: Router) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.registerForm.disable();
    this.errorMessage = undefined;
    this.httpUserService.create({
      login: this.getValue("login"),
      password: this.getValue("password"),
      username: this.getValue("username")
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.router.navigate(["/login"]),
        error: (error) => {
          this.registerForm.enable();
          switch (error.status) {
            case 400: this.errorMessage = LOGIN_PASSWORD_ERROR; break;
            case 500: this.errorMessage = USER_CREATE_ERROR; break;
            default: this.errorMessage = UNEXPECTED_ERROR;
          }
        }
      });
  }

  isInvalidOrDirty(controlName: string) {
    return this.registerForm.get(controlName)!.invalid && this.registerForm.get(controlName)!.dirty;
  }

  private confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordControl = control.get("password");
    const confirmPasswordControl = control.get("confirmPassword");

    if (passwordControl?.value !== confirmPasswordControl?.value)
      return {"passwordMismatch": true};
    return null;
  }

  private getValue(controlName: string) {
    return this.registerForm.get(controlName)!.value;
  }
}
