import { Injectable } from "@angular/core";
import { API_URL } from "../app/constants";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageDto } from "../dto/message/message-dto";

@Injectable({
  providedIn: "root"
})
export class HttpMessageService {
  private readonly URL = `${API_URL}/message`

  constructor(private http: HttpClient) { }

  get(id: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.get<MessageDto>(`${this.URL}/${id}`, {params});
  }

  getAll(chatId: number, token: string, page: number, size: number) {
    const params = new HttpParams()
      .set("chatId", chatId)
      .set("token", token)
      .set("page", page)
      .set("size", size);
    return this.http.get<any>(this.URL, {params});
  }

  createByUserInChat(chatId: number, token: string, formData: FormData) {
    const params = new HttpParams()
      .set("chatId", chatId)
      .set("token", token);
    return this.http.post<MessageDto>(this.URL, formData, {params});
  }

  updateByAuthor(id: number, token: string, newText: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.put<MessageDto>(`${this.URL}/${id}`, newText, {params});
  }

  deleteByAuthorOrMod(id: number, token: string) {
    const params = new HttpParams()
      .set("token", token);
    return this.http.delete(`${this.URL}/${id}`, {params});
  }
}
