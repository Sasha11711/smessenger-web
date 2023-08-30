import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from "rxjs";
import { HttpUserService } from "./http-user.service";

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
          case 400: errorMessage = "Invalid login or password."; break;
          case 410: errorMessage = "User is deactivated."; break;
          default: errorMessage = "Something went wrong. Please try again later.";
        }
        return of(errorMessage);
      })
    );
  }

  logout() {
    this.idUuid = undefined;
  }
}
