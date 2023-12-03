import { Injectable } from "@angular/core";
import { API_URL } from "../app/constants";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ChatInfoDto } from "../dto/chat/chat-info-dto";
import { ChatDto } from "../dto/chat/chat-dto";

@Injectable({
  providedIn: "root"
})
export class HttpChatService {
  private readonly URL = `${API_URL}/chat`

  constructor(private http: HttpClient) { }

  get(id: number) {
    return this.http.get<ChatInfoDto>(`${this.URL}/${id}`);
  }

  getByUser(id: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.get<ChatDto>(`${this.URL}/${id}/full`, {params});
  }

  createByUser(token: string, formData: FormData) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.post<ChatInfoDto>(this.URL, formData, {params});
  }

  updateByMod(id: number, token: string, formData: FormData) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.put(`${this.URL}/${id}`, formData, {params});
  }

  addUser(id: number, userId: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.put(`${this.URL}/${id}/add/${userId}`, null, {params});
  }

  leaveUser(id: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.put(`${this.URL}/${id}/leave`, null, {params});
  }

  kickUserByMod(id: number, userId: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.put(`${this.URL}/${id}/kick/${userId}`, null, {params});
  }

  banUserByMod(id: number, userId: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.put(`${this.URL}/${id}/ban/${userId}`, null, {params});
  }

  unbanUserByMod(id: number, userId: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.put(`${this.URL}/${id}/unban/${userId}`, null, {params});
  }

  setModeratorByMod(id: number, userId: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.put(`${this.URL}/${id}/mod/${userId}`, null, {params});
  }

  unsetModeratorByMod(id: number, userId: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.put(`${this.URL}/${id}/unmod/${userId}`, null, {params});
  }

  deleteByMod(id: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.delete(`${this.URL}/${id}`, {params});
  }
}
