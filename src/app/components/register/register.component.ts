import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import {
  USER_CREATE_ERROR,
  LOGIN_PASSWORD_ERROR,
  LOGIN_REGEX,
  PASSWORD_REGEX,
  UNEXPECTED_ERROR
} from "../../constants";
import { HttpUserService } from "../../services/http-user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  errorMessage: string | null = null;
  registerForm = new FormGroup({
    login: new FormControl('', [Validators.required, Validators.pattern(LOGIN_REGEX)]),
    password: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
    confirmPassword: new FormControl(''),
    username: new FormControl('', Validators.required),
  }, this.confirmPasswordValidator);

  constructor(private httpUserService: HttpUserService, private router: Router) {}

  onSubmit(): void {
    this.registerForm.disable();
    this.errorMessage = null;
    this.httpUserService.create({
        login: this.getValue('login'),
        password: this.getValue('password'),
        username: this.getValue('username')
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => {
        this.registerForm.enable();
        switch (error.status) {
          case 400: this.errorMessage = LOGIN_PASSWORD_ERROR; break;
          case 500: this.errorMessage = USER_CREATE_ERROR; break;
          default: this.errorMessage = UNEXPECTED_ERROR;
        }
      }
    })
  }

  private confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confirmPassword');

    if (passwordControl?.value !== confirmPasswordControl?.value)
        return { 'passwordMismatch': true };
    return null;
  }

  isInvalidOrDirty(controlName: string): boolean {
    return this.registerForm.get(controlName)!.invalid && this.registerForm.get(controlName)!.dirty;
  }

  private getValue(controlName: string): string {
    return this.registerForm.get(controlName)!.value;
  }
}
