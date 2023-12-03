import { Injectable } from "@angular/core";
import { catchError, of, tap } from "rxjs";
import { HttpUserService } from "./http-user.service";
import { LOGIN_PASSWORD_ERROR, UNEXPECTED_ERROR, USER_DEACTIVATED_ERROR } from "../app/constants";
import { Md5 } from "ts-md5";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  constructor(private httpUserService: HttpUserService, private cookieService: CookieService, private router: Router) { }

  login(login: string, password: string) {
    return this.httpUserService.getToken(login, Md5.hashStr(password)).pipe(
      tap(token => {
        this.cookieService.set("token", token);
        this.router.navigate(['/']);
      }),
      catchError(error => {
        let errorMessage: string;
        switch (error.status) {
          case 400: errorMessage = LOGIN_PASSWORD_ERROR; break;
          case 410: errorMessage = USER_DEACTIVATED_ERROR; break;
          default: errorMessage = UNEXPECTED_ERROR;
        }
        return of(errorMessage);
      })
    );
  }

  logout() {
    this.cookieService.delete("token");
    this.router.navigate(["/login"]);
  }

  checkToken(): boolean {
    return this.cookieService.check("token");
  }

  getToken() {
    return this.cookieService.get("token");
  }
}
