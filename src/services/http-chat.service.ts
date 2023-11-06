import { Injectable } from '@angular/core';
import { API_URL } from "../app/constants";
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

  createByUser(userToken: string, chatCreateDto: ChatCreateDto): Observable<ChatInfoDto> {
    return this.http.post<ChatInfoDto>(`${this.URL}/${userToken}`, chatCreateDto);
  }

  updateByMod(id: number, modToken: string, chatCreateDto: ChatCreateDto): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/${modToken}`, chatCreateDto);
  }

  joinUser(id: number, userId: number, friendToken: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/join/${userId}/${friendToken}`, null);
  }

  leaveUser(id: number, userToken: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/leave/${userToken}`, null);
  }

  kickUserByMod(id: number, userId: number, modToken: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/kick/${userId}/${modToken}`, null);
  }

  banUserByMod(id: number, userId: number, modToken: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/ban/${userId}/${modToken}`, null);
  }

  unbanUserByMod(id: number, userId: number, modToken: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/unban/${userId}/${modToken}`, null);
  }

  setModeratorByMod(id: number, userId: number, modToken: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/mod/${userId}/${modToken}`, null);
  }

  unsetModeratorByMod(id: number, userId: number, modToken: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/unmod/${userId}/${modToken}`, null);
  }

  deleteByMod(id: number, modToken: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${id}/${modToken}`);
  }
}
