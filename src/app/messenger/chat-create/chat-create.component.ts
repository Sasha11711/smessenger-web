import {Component, OnDestroy} from '@angular/core';
import {HttpChatService} from "../../../services/http-chat.service";
import {AuthService} from "../../../services/auth.service";
import {Subscription} from "rxjs";
import {ChatInfoDto} from "../../../dto/chat/chat-info-dto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat-create',
  templateUrl: './chat-create.component.html',
  styleUrls: ['./chat-create.component.scss']
})
export class ChatCreateComponent implements OnDestroy {
  chatCreate = {
    title: '',
    image: undefined
  }
  private subscription = new Subscription();

  constructor(private httpChatService: HttpChatService, private authService: AuthService, private router: Router) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    let token = this.authService.token!;
    this.subscription = this.httpChatService.createByUser(token, this.chatCreate).subscribe({
      next: (chatInfo: ChatInfoDto) => {
        this.router.navigate(['', {queryParams: {chat: chatInfo.id}}]);
      },
      error: (error) => {
        if (error.status != 504) this.authService.logout();
      }
    });
  }
}
