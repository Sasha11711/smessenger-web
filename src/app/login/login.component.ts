import { Component, OnDestroy } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy {
  errorMessage?: string;
  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  private subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    this.loginForm.disable();
    this.errorMessage = undefined;
    this.subscription.add(
      this.authService.login(this.getValue("login"), this.getValue("password")).subscribe(error => {
        if (error) {
          this.loginForm.enable();
          this.errorMessage = error;
        }
        else this.router.navigate(['/']);
      })
    );
  }

  private getValue(controlName: string): string {
    return this.loginForm.get(controlName)!.value;
  }
}
