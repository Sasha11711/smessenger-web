import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from "rxjs";
import { HttpUserService } from "./http-user.service";
import { LOGIN_PASSWORD_ERROR, UNEXPECTED_ERROR, USER_DEACTIVATED_ERROR } from "../app/constants";
import { Md5 } from "ts-md5";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token?: string;

  constructor(private httpUserService: HttpUserService) { }

  login(login: string, password: string): Observable<string | null> {
    let md5Password = Md5.hashStr(password);
    return this.httpUserService.getToken(login, md5Password).pipe(
      map(token => {
        this.token = token;
        return null;
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

  logout(): void {
    this.token = undefined;
  }
}
