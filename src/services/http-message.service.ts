import { Injectable } from "@angular/core";
import { API_URL } from "../app/constants";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageCreateDto } from "../dto/message/message-create-dto";
import { MessageDto } from "../dto/message/message-dto";

@Injectable({
  providedIn: "root"
})
export class HttpMessageService {
  private readonly URL = `${API_URL}/message`

  constructor(private http: HttpClient) {
  }

  get(id: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.get<MessageDto>(`${this.URL}/${id}`, {params});
  }

  getAll(chatId: number, token: string, page: number, size: number) {
    let params = new HttpParams()
      .set("chatId", chatId)
      .set("token", token)
      .set("page", page)
      .set("size", size);
    return this.http.get<any>(this.URL, {params});
  }

  createByUserInChat(chatId: number, token: string, messageCreateDto: MessageCreateDto) {
    const params = new HttpParams()
      .set("chatId", chatId)
      .set("token", token);
    return this.http.post<MessageDto>(this.URL, messageCreateDto, {params});
  }

  updateByAuthor(id: number, token: string, newText: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.put(`${this.URL}/${id}`, newText, {params});
  }

  deleteByAuthorOrMod(id: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.delete(`${this.URL}/${id}`, {params});
  }
}
