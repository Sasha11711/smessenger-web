import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorMessage: string | null = null;
  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.loginForm.disable();
    this.errorMessage = null;
    this.authService.login(this.getValue("login"), this.getValue("password")).subscribe(error => {
      if (error) {
        this.loginForm.enable();
        this.errorMessage = error;
      }
      else this.router.navigate(['/']);
    });
  }

  private getValue(controlName: string): string {
    return this.loginForm.get(controlName)!.value;
  }
}
