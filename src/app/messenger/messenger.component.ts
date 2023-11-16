import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserDto } from "../../dto/user/user-dto";
import { ChatDto } from "../../dto/chat/chat-dto";
import { HttpUserService } from "../../services/http-user.service";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-messenger",
  templateUrl: "./messenger.component.html",
  styleUrls: ["./messenger.component.scss"]
})
export class MessengerComponent implements OnInit, OnDestroy {
  user?: UserDto;
  chat?: ChatDto;
  isChatSettings = false;
  isDesktop: boolean;
  private subscription?: Subscription;

  constructor(private httpUserService: HttpUserService, private authService: AuthService) {
    this.isDesktop = window.innerWidth >= 1048;
  }

  ngOnInit() {
    this.subscribeGetUser();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  subscribeGetUser() {
    let token = this.authService.getToken();
    this.subscription = this.httpUserService.getFull(token).subscribe({
      next: (user: UserDto) => {
        this.user = user;
        if (this.chat) {
          this.chat = this.user.chats.find(value => value.id === this.chat!.id);
        }
        setTimeout(() => {
          this.subscribeGetUser();
        }, 3000);
      },
      error: (error) => {
        if (error.status !== 504) this.authService.logout();
        else setTimeout(() => {
          this.subscribeGetUser();
        }, 5000);
      }
    });
  }

  selectChat(chat: ChatDto) {
    this.chat = chat;
  }

  unselectChat() {
    this.chat = undefined;
    this.isChatSettings = false;
  }

  toggleSettings() {
    this.isChatSettings = !this.isChatSettings;
  }
}
