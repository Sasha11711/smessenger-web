import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ChatDto } from "../../../dto/chat/chat-dto";
import { MessageDto } from "../../../dto/message/message-dto";
import { UserDto } from "../../../dto/user/user-dto";
import { repeat, Subject, takeUntil } from "rxjs";
import { AuthService } from "../../../services/auth.service";
import { HttpMessageService } from "../../../services/http-message.service";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { ContextButton, ContextMenuComponent } from "../context-menu/context-menu.component";
import { ContextMenuService } from "../../../services/context-menu.service";
import { IMAGE_MESSAGE_TEXT } from "../../constants";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit, OnDestroy {
  protected readonly anyValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return (!control.get("text")!.value && !control.get("embed")!.value) ? {empty: true} : null;
  }
  protected readonly editValidator = (control: AbstractControl): ValidationErrors | null => {
    let newText = control!.get("newText")!.value;
    return !newText || newText == this.editMessageItem!.text ? {invalid: true} : null;
  };
  protected readonly PAGE_SIZE = 20;
  @Input() user!: UserDto;
  @Input() chat!: ChatDto;
  @Output() onChatUnselected = new EventEmitter();
  @Output() onSettingsToggled = new EventEmitter();
  messages?: MessageDto[];
  page = 0;
  isLastPage = true;
  embedURL?: string;
  messageForm = new FormGroup({
    text: new FormControl<string>('', Validators.maxLength(255)),
    embed: new FormControl<Blob | null>(null)
  }, this.anyValidator);
  editMessageItem?: MessageDto;
  editMessageForm = new FormGroup({
    newText: new FormControl<string>('', Validators.maxLength(255))
  }, this.editValidator);
  contextMenuComponent?: ContextMenuComponent;
  private destroy$ = new Subject<void>();
  private getMessagesDestroy$ = new Subject<void>();

  constructor(private httpMessageService: HttpMessageService, private authService: AuthService, contextMenuService: ContextMenuService) {
    contextMenuService.subject
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.disableContextMenu());
  }

  ngOnInit() {
    this.subscribeGetMessages();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.getMessagesDestroy$.next();
    this.getMessagesDestroy$.complete();
  }

  subscribeGetMessages() {
    this.getMessagesDestroy$.next();
    let token = this.authService.getToken();
    this.httpMessageService.getAll(this.chat.id, token, this.page, this.PAGE_SIZE)
      .pipe(
        repeat({delay: 1000}),
        takeUntil(this.getMessagesDestroy$))
      .subscribe({
        next: (messages) => {
          this.isLastPage = messages.last;
          let newMessages = (messages.content as MessageDto[]).sort((a, b) => b.id - a.id);
          if (JSON.stringify(this.messages) != JSON.stringify(newMessages))
            this.messages = newMessages;
        },
        error: (error) => {
          if (error.status === 401) this.authService.logout();
        }
      });
  }

  nextPage() {
    this.page++;
    this.subscribeGetMessages();
  }

  resetPage() {
    this.page = 0;
    this.subscribeGetMessages();
  }

  setEmbed(event: any) {
    if (event.target.value) {
      this.messageForm.controls["embed"].setValue(event.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.embedURL = reader.result as string;
      }
    } else {
      this.messageForm.controls["embed"].setValue(null);
      this.embedURL = undefined;
    }
  }

  onSubmit() {
    if (this.messages === undefined)
      return;
    this.messageForm.disable();
    if (this.page) this.resetPage();
    let token = this.authService.getToken();
    let text = this.messageForm.get("text")?.value;
    let embed = this.messageForm.get("embed")?.value;
    const formData = new FormData();
    if (text) formData.append("text", text);
    if (embed) formData.append("embed", embed);
    this.httpMessageService.createByUserInChat(this.chat.id, token, formData).subscribe({
      next: (message) => {
        this.messages?.unshift(message);
        this.messageForm.controls["text"].setValue('');
        this.messageForm.controls["embed"].setValue(null);
        this.embedURL = undefined;
        this.messageForm.enable();
      },
      error: (err) => {
        if (err.status == 401) this.authService.logout();
        else this.messageForm.enable();
      }
    });
  }

  startEditMessage(messageDto: MessageDto) {
    this.editMessageItem = messageDto;
    this.editMessageForm.controls["newText"].setValue(messageDto.text ?? '');
  }

  cancelEditMessage() {
    this.editMessageItem = undefined;
  }

  onEditSubmit() {
    let token = this.authService.getToken();
    let newText = this.editMessageForm.get("newText")!.value!;
    this.httpMessageService.updateByAuthor(this.editMessageItem!.id, token, newText).subscribe({
      next: (message) => {
        this.messages![this.messages!.findIndex(m => m.id === message.id)] = message;
        this.editMessageItem = undefined;
        this.editMessageForm.enable();
      },
      error: (err) => {
        if (err.status == 401) this.authService.logout();
        else this.messageForm.enable();
      }
    });
  }

  deleteMessage(messageId: number) {
    let token = this.authService.getToken();
    this.httpMessageService.deleteByAuthorOrMod(messageId, token).subscribe({
      next: () => {
        this.messages!.splice(this.messages!.findIndex(m => m.id === messageId), 1);
      },
      error: (err) => {
        if (err.status == 401) this.authService.logout();
      }
    });
  }

  enableContextMenu(event: MouseEvent, messageDto: MessageDto) {
    if (!this.contextMenuComponent) {
      event.preventDefault();
      this.contextMenuComponent = new ContextMenuComponent();
      this.contextMenuComponent.buttons = [];
      if (messageDto.text) {
        let copyTextSubject = new Subject<void>();
        copyTextSubject.subscribe(() => navigator.clipboard.writeText(messageDto.text!));
        this.contextMenuComponent.buttons.push(new ContextButton("Copy text", copyTextSubject));
      }
      if (messageDto.author.id == this.user.id) {
        let editMessageSubject = new Subject<void>();
        editMessageSubject.subscribe(() => this.startEditMessage(messageDto));
        this.contextMenuComponent.buttons.push(new ContextButton("Edit message", editMessageSubject));
      }
      if (messageDto.author.id == this.user.id || this.user.moderatorAt.includes(this.chat.id)) {
        let deleteMessageSubject = new Subject<void>();
        deleteMessageSubject.subscribe(() => this.deleteMessage(messageDto.id));
        this.contextMenuComponent.buttons.push(new ContextButton("Delete message", deleteMessageSubject));
      }
      if (this.contextMenuComponent.buttons.length > 0) {
        this.contextMenuComponent.title = `${messageDto.id}. ${messageDto.text ?? IMAGE_MESSAGE_TEXT}`;
        this.contextMenuComponent.x = event.clientX;
        this.contextMenuComponent.y = event.clientY;
      }
    } else this.disableContextMenu();
  }

  disableContextMenu() {
    this.contextMenuComponent = undefined;
  }

  isBlocked(user: UserInfoDto) {
    return this.user.blockedUsers.find(u => u.id === user.id) !== undefined;
  }
}
