import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ChatDto } from "../../../dto/chat/chat-dto";
import { MessageDto } from "../../../dto/message/message-dto";
import { UserDto } from "../../../dto/user/user-dto";
import { repeat, Subject, takeUntil } from "rxjs";
import { AuthService } from "../../../services/auth.service";
import { HttpMessageService } from "../../../services/http-message.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit, OnDestroy {
  protected readonly PAGE_SIZE = 10;
  @Input() user!: UserDto;
  @Input() chat!: ChatDto;
  @Output() onChatUnselected = new EventEmitter();
  @Output() onSettingsToggled = new EventEmitter();
  embedURL?: string;
  embed?: File;
  message?: string;
  isLoading = true;
  messages?: MessageDto[];
  page: number = 1;
  private destroy$ = new Subject<void>();

  constructor(private httpMessageService: HttpMessageService, private authService: AuthService) {}

  ngOnInit() {
    this.subscribeGetMessages();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeGetMessages() {
    let token = this.authService.getToken();
    this.httpMessageService.getAll(this.chat.id, token, this.page, this.PAGE_SIZE)
      .pipe(
        repeat({delay: 1000}),
        takeUntil(this.destroy$))
      .subscribe({
        next: (messages) => {
          this.messages = messages.content;
          this.isLoading = false;
        },
        error: (error) => {
          if (error.status === 401) this.authService.logout();
        }
      });
  }

  setEmbed(event: any) {
    if (event.target.value) {
      this.embed = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.embed!);
      reader.onload = () => {
        this.embedURL = reader.result as string;
      }
    }
  }

  onSubmit() {
    if (this.message != undefined || this.embed != undefined) {
      let token = this.authService.getToken();
      this.httpMessageService.createByUserInChat(this.chat.id, token, {
        text: this.message,
        embedImage: this.embed
      })
    }
  }
}
