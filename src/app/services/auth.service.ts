import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from "rxjs";
import { HttpUserService } from "./http-user.service";
import { LOGIN_PASSWORD_ERROR, UNEXPECTED_ERROR, USER_DEACTIVATED_ERROR } from "../constants";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  idUuid: string | undefined;

  constructor(private httpUserService: HttpUserService) { }

  login(login: string, password: string): Observable<string | null> {
    return this.httpUserService.getIdUuid(login, password).pipe(
      map(idUuid => {
        this.idUuid = idUuid;
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
    this.idUuid = undefined;
  }
}
