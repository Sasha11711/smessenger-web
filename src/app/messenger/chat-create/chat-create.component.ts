import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { HttpChatService } from "../../../services/http-chat.service";
import { AuthService } from "../../../services/auth.service";
import { Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ChatDto } from "../../../dto/chat/chat-dto";
import { API_URL } from "../../constants";

@Component({
  selector: "app-chat-create",
  templateUrl: "./chat-create.component.html",
  styleUrls: ["./chat-create.component.scss"]
})
export class ChatCreateComponent implements OnInit, OnDestroy {
  @Input() chat?: ChatDto;
  imageURL?: string;
  chatForm = new FormGroup({
    title: new FormControl<string>('', [Validators.required, Validators.maxLength(255)]),
    image: new FormControl<Blob | null>(null)
  })
  private destroy$ = new Subject<void>();

  constructor(private httpChatService: HttpChatService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.chat) {
      this.chatForm.controls["title"].setValue(this.chat.title);
      this.imageURL = `${API_URL}/image/${this.chat.imageId}`;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setImage(event: any) {
    if (event.target.value) {
      let file = event.target.files[0];
      this.chatForm.controls["image"].setValue(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.imageURL = reader.result as string;
    } else {
      this.chatForm.controls["image"].setValue(null);
      this.imageURL = `${API_URL}/image/${this.chat?.imageId}`;
    }
  }

  onSubmit() {
    this.chatForm.disable();
    let token = this.authService.getToken();
    let image = this.chatForm.get("image")?.value;
    const formData = new FormData();
    formData.append("title", this.chatForm.get("title")!.value!);
    if (image) formData.append("image", image);
    if (this.chat) {
      this.httpChatService.updateByMod(this.chat.id, token, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.chatForm.enable(),
          error: (err) => {
            if (err.status == 401) this.authService.logout();
            else this.chatForm.enable();
          }
        });
    } else {
      this.httpChatService.createByUser(token, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.router.navigate([""]),
          error: (err) => {
            if (err.status == 401) this.authService.logout();
            else this.chatForm.enable();
          }
        });
    }
  }
}
