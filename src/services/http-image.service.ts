import { Injectable } from "@angular/core";
import { API_URL } from "../app/constants";
import { HttpClient } from "@angular/common/http";
import { Image } from "../dto/image";

@Injectable({
  providedIn: "root"
})
export class HttpImageService {
  private readonly URL = `${API_URL}/image`

  constructor(private http: HttpClient) { }

  get(id: number) {
    return this.http.get<Image>(`${this.URL}/${id}`);
  }
}
