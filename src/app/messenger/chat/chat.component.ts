import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {ChatDto} from "../../../dto/chat/chat-dto";
import {MessageDto} from "../../../dto/message/message-dto";
import {UserDto} from "../../../dto/user/user-dto";
import {repeat, Subject, takeUntil} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {HttpMessageService} from "../../../services/http-message.service";
import {FormControl, FormGroup} from "@angular/forms";

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
  messages?: MessageDto[];
  page: number = 1;
  embedURL?: string;
  messageForm = new FormGroup({
    message: new FormControl(),
    embed: new FormControl()
  })
  private destroy$ = new Subject<void>();

  constructor(private httpMessageService: HttpMessageService, private authService: AuthService) {
  }

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
        },
        error: (error) => {
          if (error.status === 401) this.authService.logout();
        }
      });
  }

  setEmbed(event: any) {
    if (event.target.value) {
      this.messageForm.controls["embed"] = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.embedURL = reader.result as string;
      }
    }
  }

  onSubmit() {
      this.messageForm.disable();
      let token = this.authService.getToken();
      // this.httpMessageService.createByUserInChat(this.chat.id, token, {
      //   text: this.chatForm.controls["message"].value??undefined,
      //   embedImage: this.chatForm.controls["embed"].value??undefined
      // }).subscribe({
      //   next: (message) => {
      //     this.messages?.push(message);
      //     this.chatForm = undefined;
      //     this.embed = undefined;
      //     this.embedURL = undefined;
      //     this.isSending = false;
      //   },
      //   error: (err) => {
      //     if (err.status == 401) this.authService.logout();
      //     else this.isSending = false;
      //   }
      // })
  }

  anyValidator(fg: FormGroup) {
    // if (fg.controls["message"] != null || this.embed)
  }
}
