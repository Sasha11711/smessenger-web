import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoggingIn: boolean = false;
  errorMessage: string | null = null;
  login: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLoginSubmit() {
    this.isLoggingIn = true;
    this.errorMessage = null;
    this.authService.login(this.login, this.password).subscribe(error => {
      if (error) {
        this.isLoggingIn = false;
        this.errorMessage = error;
      }
      else this.router.navigate(['/']);
    });
  }
}
