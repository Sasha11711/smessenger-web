import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDto } from "../../dto/user/user-dto";
import { ChatDto } from "../../dto/chat/chat-dto";
import { HttpUserService } from "../../services/http-user.service";
import { AuthService } from "../../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit, OnDestroy {
  user?: UserDto;
  chat?: ChatDto;
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
    let token = this.authService.token!;
    this.subscription = this.httpUserService.getFull(token).subscribe({
      next: (user: UserDto) => {
        this.user = user;
        setTimeout(() => {
          this.subscribeGetUser();
        }, 3);
      },
      error: (error) => {
        if (error.status !== 504) this.authService.logout();
        else setTimeout(() => {
          this.subscribeGetUser();
        }, 5);
      }
    });
  }

  selectChat(chat: ChatDto) {
    this.chat = chat;
  }
}
