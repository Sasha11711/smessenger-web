import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ChatDto } from "../../../dto/chat/chat-dto";
import { MessageDto } from "../../../dto/message/message-dto";
import { UserDto } from "../../../dto/user/user-dto";
import { repeat, Subject, takeUntil } from "rxjs";
import { AuthService } from "../../../services/auth.service";
import { HttpMessageService } from "../../../services/http-message.service";
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from "@angular/forms";

const anyValidator: ValidatorFn = (control: AbstractControl) => {
  return (!control.get("text")!.value && !control.get("embed")!.value) ? {empty: true} : null;
}

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
    text: new FormControl<string>(''),
    embed: new FormControl<Blob | null>(null)
  }, anyValidator);
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
      this.messageForm.controls["embed"].setValue(event.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.embedURL = reader.result as string;
      }
    }
    else {
      this.messageForm.controls["embed"].setValue(null);
      this.embedURL = undefined;
    }
  }

  onSubmit() {
    console.log(this.messageForm);
    this.messageForm.disable();
    let token = this.authService.getToken();
    let text = this.messageForm.get('text')?.value;
    let embed = this.messageForm.get('embed')?.value;
    const formData = new FormData();
    if (text) formData.append('text', text);
    if (embed) formData.append('embed', embed);
    this.httpMessageService.createByUserInChat(this.chat.id, token, formData).subscribe({
      next: (message) => {
        this.messages?.push(message);
        this.messageForm.controls["text"].setValue(null);
        this.messageForm.controls["embed"].setValue(null);
        this.embedURL = undefined;
        this.messageForm.enable();
      },
      error: (err) => {
        if (err.status == 401) this.authService.logout();
        else this.messageForm.enable();
      }
    })
  }
}
