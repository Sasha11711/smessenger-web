import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {HttpChatService} from "../../../services/http-chat.service";
import {AuthService} from "../../../services/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
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
  image?: File;
  chatForm = new FormGroup({
    title: new FormControl('', Validators.required),
    image: new FormControl(null)
  })
  private subscription = new Subscription();

  constructor(private httpChatService: HttpChatService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.chat) {
      this.chatForm.get('title')!.setValue(this.chat.title);
      this.imageURL = `${API_URL}/image/${this.chat.imageId}`;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setImage(event: any) {
    if (event.target.value) {
      this.image = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.image!);
      reader.onload = () => {
        this.imageURL = reader.result as string;
      }
    }
  }

  onSubmit() {
    this.chatForm.disable();
    let token = this.authService.getToken();
    const formData = new FormData();
    formData.append('title', this.chatForm.get('title')!.value!);
    if (this.image) {
      formData.append('image', this.image, this.image.name);
    }
    if (this.chat) {
      this.subscription.add(
          this.httpChatService.updateByMod(this.chat.id, token, formData).subscribe({
                complete: () => this.chatForm.enable()
              }
          ));
    }
    else {
      this.subscription.add(
          this.httpChatService.createByUser(token, formData).subscribe({
                next: () => this.router.navigate([""]),
                error: () => this.chatForm.enable()
              }
          ));
    }
  }
}
