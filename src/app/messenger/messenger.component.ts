import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserDto } from "../../dto/user/user-dto";
import { ChatDto } from "../../dto/chat/chat-dto";
import { HttpUserService } from "../../services/http-user.service";
import { AuthService } from "../../services/auth.service";
import { repeat, Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-messenger",
  templateUrl: "./messenger.component.html",
  styleUrls: ["./messenger.component.scss"]
})
export class MessengerComponent implements OnInit, OnDestroy {
  user?: UserDto;
  chat?: ChatDto;
  chatId?: number;
  isChatSettings = false;
  isDesktop: boolean;
  private destroy$ = new Subject<void>();

  constructor(private httpUserService: HttpUserService, private authService: AuthService, private router: Router) {
    this.isDesktop = window.innerWidth >= 1048;
  }

  ngOnInit() {
    this.subscribeGetUser();
    let queryParams = this.router.parseUrl(this.router.url).queryParamMap;
    if (queryParams.has("chat")) {
      this.chatId = parseInt(queryParams.get("chat")!);
    }
    if (queryParams.has("settings")) {
      this.isChatSettings = true;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeGetUser() {
    let token = this.authService.getToken();
    this.httpUserService.getFull(token)
      .pipe(
        repeat({delay: 1000}),
        takeUntil(this.destroy$))
      .subscribe({
        next: (user: UserDto) => {
          if (JSON.stringify(this.user) != JSON.stringify(user)) {
            this.user = user;
            if (this.chat) this.chat = this.user.chats.find(value => value.id === this.chat!.id);
            else if (this.chatId) this.chat = this.user.chats.find(chat => chat.id === this.chatId);
          }
        },
        error: (err) => {
          if (err.status === 401) this.authService.logout();
        }
      });
  }

  selectChat(chat: ChatDto) {
    this.chat = chat;
    this.isChatSettings = false;
    this.router.navigate([], {
      queryParams: {
        chat: this.chat.id
      }
    });
  }

  unselectChat() {
    this.chat = undefined;
    this.chatId = undefined;
    this.router.navigate([], {
      queryParams: {
        chat: undefined
      }
    });
  }

  leaveChat(chatId: number) {
    this.user!.chats = this.user!.chats.filter(chat => chat.id !== chatId);
    this.user!.moderatorAt = this.user!.moderatorAt.filter(id => id !== chatId);
    this.unselectChat();
  }

  toggleSettings() {
    this.isChatSettings = !this.isChatSettings;
    this.router.navigate([], {
      queryParams: {
        chat: this.chat!.id,
        settings: this.isChatSettings ? this.isChatSettings : undefined
      }
    });
  }
}
