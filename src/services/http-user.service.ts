import { Injectable } from '@angular/core';
import { API_URL } from "../app/constants";
import { HttpClient } from "@angular/common/http";
import { UserInfoDto } from "../dto/user/user-info-dto";
import { UserDto } from "../dto/user/user-dto";
import { UserUpdateDto } from "../dto/user/user-update-dto";
import { Observable } from "rxjs";
import { UserCreateDto } from "../dto/user/user-create-dto";

@Injectable({
  providedIn: 'root'
})
export class HttpUserService {
  private readonly URL = `${API_URL}/user`

  constructor(private http: HttpClient) { }

  getAllByUsername(username: string): Observable<Set<UserInfoDto>> {
    return this.http.get<Set<UserInfoDto>>(`${this.URL}/find-by-username/${username}`);
  }

  get(id: number): Observable<UserInfoDto> {
    return this.http.get<UserInfoDto>(`${this.URL}/${id}`);
  }

  getFull(token: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.URL}/get-full/${token}`);
  }

  getToken(login: string, password: string): Observable<string> {
    return this.http.get(`${this.URL}/get-token/${login}&${password}`, {responseType: 'text'});
  }

  create(userCreateDto: UserCreateDto): Observable<Object> {
    return this.http.post(this.URL, userCreateDto);
  }

  update(token: string, userUpdateDto: UserUpdateDto): Observable<Object> {
    return this.http.put(`${this.URL}/${token}`, userUpdateDto);
  }

  changePassword(token: string, login: string, oldPassword: string, newPassword: string): Observable<Object> {
    return this.http.put(`${this.URL}/${token}/${login}&${oldPassword}/${newPassword}`, null);
  }

  addFriendRequest(token: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${token}/add-request/${userId}`, null);
  }

  removeFriendRequest(token: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${token}/remove-request/${userId}`, null);
  }

  declineFriendRequest(token: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${token}/decline-request/${userId}`, null);
  }

  acceptFriendRequest(token: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${token}/accept-request/${userId}`, null);
  }

  removeFriend(token: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${token}/remove-friend/${userId}`, null);
  }

  blockUser(token: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${token}/block/${userId}`, null);
  }

  unblockUser(token: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${token}/unblock/${userId}`, null);
  }

  resetUuid(token: string): Observable<Object> {
    return this.http.put(`${this.URL}/${token}/reset-uuid`, null);
  }

  delete(token: string, login: string, password: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${token}/${login}&${password}`);
  }
}
