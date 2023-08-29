import { Injectable } from '@angular/core';
import { API_URL } from "../constants";
import { HttpClient } from "@angular/common/http";
import { MessageCreateDto } from "../dto/message/message-create-dto";
import { MessageDto } from "../dto/message/message-dto";

@Injectable({
  providedIn: 'root'
})
export class HttpMessageService {
  private readonly URL = `${API_URL}/message`

  constructor(private http: HttpClient) { }

  get(id: number, userIdUuid: string) {
    return this.http.get<MessageDto>(`${this.URL}/${id}/${userIdUuid}`);
  }

  createByUserInChat(userIdUuid: string, chatId: number, messageCreateDto: MessageCreateDto) {
    return this.http.post(`${this.URL}/${userIdUuid}/${chatId}`, messageCreateDto);
  }

  updateByAuthor(id: number, userIdUuid: string, newText: string) {
    return this.http.put(`${this.URL}/${id}/${userIdUuid}/${newText}`, null);
  }

  deleteByAuthorOrMod(id: number, userIdUuid: string) {
    return this.http.delete(`${this.URL}/${id}/${userIdUuid}`);
  }
}
