import { Injectable } from '@angular/core';
import { API_URL } from "../constants";
import { HttpClient } from "@angular/common/http";
import { ChatInfoDto } from "../dto/chat/chat-info-dto";
import { ChatCreateDto } from "../dto/chat/chat-create-dto";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpChatService {
  private readonly URL = `${API_URL}/chat`

  constructor(private http: HttpClient) { }

  get(id: number): Observable<ChatInfoDto> {
    return this.http.get<ChatInfoDto>(`${this.URL}/${id}`);
  }

  createByUser(userIdUuid: string, chatCreateDto: ChatCreateDto): Observable<Object> {
    return this.http.post(`${this.URL}/${userIdUuid}`, chatCreateDto);
  }

  updateByMod(id: number, modIdUuid: string, chatCreateDto: ChatCreateDto): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/${modIdUuid}`, chatCreateDto);
  }

  joinUser(id: number, userId: number, friendIdUuid: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/join/${userId}/${friendIdUuid}`, null);
  }

  leaveUser(id: number, userIdUuid: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/leave/${userIdUuid}`, null);
  }

  kickUserByMod(id: number, userId: number, modIdUuid: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/kick/${userId}/${modIdUuid}`, null);
  }

  banUserByMod(id: number, userId: number, modIdUuid: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/ban/${userId}/${modIdUuid}`, null);
  }

  unbanUserByMod(id: number, userId: number, modIdUuid: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/unban/${userId}/${modIdUuid}`, null);
  }

  setModeratorByMod(id: number, userId: number, modIdUuid: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/mod/${userId}/${modIdUuid}`, null);
  }

  unsetModeratorByMod(id: number, userId: number, modIdUuid: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/unmod/${userId}/${modIdUuid}`, null);
  }

  deleteByMod(id: number, modIdUuid: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${id}/${modIdUuid}`);
  }
}
