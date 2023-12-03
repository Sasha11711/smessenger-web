import { Injectable } from "@angular/core";
import { API_URL } from "../app/constants";
import { HttpClient, HttpParams } from "@angular/common/http";
import { UserInfoDto } from "../dto/user/user-info-dto";
import { UserDto } from "../dto/user/user-dto";
import { UserUpdateDto } from "../dto/user/user-update-dto";
import { UserCreateDto } from "../dto/user/user-create-dto";

@Injectable({
  providedIn: "root"
})
export class HttpUserService {
  private readonly URL = `${API_URL}/user`

  constructor(private http: HttpClient) {
  }

  getAllByUsername(username: string) {
    const params = new HttpParams().set("username", username);
    return this.http.get<UserInfoDto[]>(`${this.URL}/find`, {params});
  }

  get(id: number) {
    return this.http.get<UserInfoDto>(`${this.URL}/${id}`);
  }

  getFull(token: string) {
    const params = new HttpParams().set("token", token);
    return this.http.get<UserDto>(`${this.URL}/get-full`, {params});
  }

  getToken(login: string, password: string) {
    const params = new HttpParams()
      .set("login", login)
      .set("password", password);

    return this.http.get(`${this.URL}/get-token`, {params, responseType: "text"});
  }

  create(userCreateDto: UserCreateDto) {
    return this.http.post(this.URL, userCreateDto);
  }

  update(token: string, formData: FormData) {
    const params = new HttpParams().set("token", token);
    return this.http.put(this.URL, formData, {params});
  }

  changePassword(token: string, login: string, password: string, newPassword: string) {
    const params = new HttpParams()
      .set("token", token)
      .set("login", login)
      .set("password", password)
      .set("newPassword", newPassword);

    return this.http.put(`${this.URL}/change-password`, null, {params});
  }

  addFriendRequest(token: string, userId: number) {
    const params = new HttpParams().set("token", token);
    return this.http.put(`${this.URL}/add-request/${userId}`, null, {params});
  }

  removeFriendRequest(token: string, userId: number) {
    const params = new HttpParams().set("token", token);
    return this.http.put(`${this.URL}/remove-request/${userId}`, null, {params});
  }

  declineFriendRequest(token: string, userId: number) {
    const params = new HttpParams().set("token", token);
    return this.http.put(`${this.URL}/decline-request/${userId}`, null, {params});
  }

  acceptFriendRequest(token: string, userId: number) {
    const params = new HttpParams().set("token", token);
    return this.http.put(`${this.URL}/accept-request/${userId}`, null, {params});
  }

  removeFriend(token: string, userId: number) {
    const params = new HttpParams().set("token", token);
    return this.http.put(`${this.URL}/remove-friend/${userId}`, null, {params});
  }

  blockUser(token: string, userId: number) {
    const params = new HttpParams().set("token", token);
    return this.http.put(`${this.URL}/block/${userId}`, null, {params});
  }

  unblockUser(token: string, userId: number) {
    const params = new HttpParams().set("token", token);
    return this.http.put(`${this.URL}/unblock/${userId}`, null, {params});
  }

  resetUuid(token: string) {
    const params = new HttpParams().set("token", token);
    return this.http.put(`${this.URL}/reset-uuid`, null, {params});
  }

  delete(token: string, login: string, password: string) {
    const params = new HttpParams()
      .set("token", token)
      .set("login", login)
      .set("password", password);

    return this.http.delete(this.URL, {params});
  }
}
