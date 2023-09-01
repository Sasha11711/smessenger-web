import { Injectable } from '@angular/core';
import { API_URL } from "../constants";
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

  getFull(idUuid: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.URL}/get-full/${idUuid}`);
  }

  getIdUuid(login: string, password: string): Observable<string> {
    return this.http.get<string>(`${this.URL}/get-id-uuid/${login}&${password}`);
  }

  create(userCreateDto: UserCreateDto): Observable<Object> {
    return this.http.post(this.URL, userCreateDto);
  }

  update(idUuid: string, userUpdateDto: UserUpdateDto): Observable<Object> {
    return this.http.put(`${this.URL}/${idUuid}`, userUpdateDto);
  }

  changePassword(idUuid: string, login: string, oldPassword: string, newPassword: string): Observable<Object> {
    return this.http.put(`${this.URL}/${idUuid}/${login}&${oldPassword}/${newPassword}`, null);
  }

  addFriendRequest(idUuid: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${idUuid}/add-request/${userId}`, null);
  }

  removeFriendRequest(idUuid: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${idUuid}/remove-request/${userId}`, null);
  }

  declineFriendRequest(idUuid: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${idUuid}/decline-request/${userId}`, null);
  }

  acceptFriendRequest(idUuid: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${idUuid}/accept-request/${userId}`, null);
  }

  removeFriend(idUuid: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${idUuid}/remove-friend/${userId}`, null);
  }

  blockUser(idUuid: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${idUuid}/block/${userId}`, null);
  }

  unblockUser(idUuid: string, userId: number): Observable<Object> {
    return this.http.put(`${this.URL}/${idUuid}/unblock/${userId}`, null);
  }

  resetUuid(idUuid: string): Observable<Object> {
    return this.http.put(`${this.URL}/${idUuid}/reset-uuid`, null);
  }

  delete(idUuid: string, login: string, password: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${idUuid}/${login}&${password}`);
  }
}
