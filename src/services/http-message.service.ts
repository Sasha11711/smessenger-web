import { Injectable } from '@angular/core';
import { API_URL } from "../app/constants";
import { HttpClient } from "@angular/common/http";
import { MessageCreateDto } from "../dto/message/message-create-dto";
import { MessageDto } from "../dto/message/message-dto";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpMessageService {
  private readonly URL = `${API_URL}/message`

  constructor(private http: HttpClient) { }

  get(id: number, userToken: string): Observable<MessageDto> {
    return this.http.get<MessageDto>(`${this.URL}/${id}/${userToken}`);
  }

  createByUserInChat(userToken: string, chatId: number, messageCreateDto: MessageCreateDto): Observable<MessageDto> {
    return this.http.post<MessageDto>(`${this.URL}/${userToken}/${chatId}`, messageCreateDto);
  }

  updateByAuthor(id: number, userToken: string, newText: string): Observable<Object> {
    return this.http.put(`${this.URL}/${id}/${userToken}/${newText}`, null);
  }

  deleteByAuthorOrMod(id: number, userToken: string): Observable<Object> {
    return this.http.delete(`${this.URL}/${id}/${userToken}`);
  }
}
