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
  @Input() user!: UserDto;
  @Input() chat!: ChatDto;
  @Output() onChatUnselected = new EventEmitter();
  @Output() onSettingsToggled = new EventEmitter();
  protected readonly anyValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return (!control.get("text")!.value && !control.get("embed")!.value) ? {empty: true} : null;
  }
  protected readonly editValidator = (control: AbstractControl): ValidationErrors | null => {
    const newText = control!.get("newText")!.value;
    return !newText || newText == this.editMessageItem!.text ? {invalid: true} : null;
  };
  protected readonly PAGE_SIZE = 20;
  protected messages?: MessageDto[];
  protected page = 0;
  protected isLastPage = true;
  protected embedURL?: string;
  protected messageForm = new FormGroup({
    text: new FormControl<string>('', Validators.maxLength(255)),
    embed: new FormControl<Blob | null>(null)
  }, this.anyValidator);
  protected editMessageItem?: MessageDto;
  protected editMessageForm = new FormGroup({
    newText: new FormControl<string>('', Validators.maxLength(255))
  }, this.editValidator);
  protected contextMenuComponent?: ContextMenuComponent;
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

  protected nextPage() {
    this.page++;
    this.subscribeGetMessages();
  }

  protected resetPage() {
    this.page = 0;
    this.subscribeGetMessages();
  }

  protected setEmbed(event: any) {
    if (event.target.value) {
      const file = event.target.files[0];
      this.messageForm.controls["embed"].setValue(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.embedURL = reader.result as string;
    } else {
      this.messageForm.controls["embed"].setValue(null);
      this.embedURL = undefined;
    }
  }

  protected onSubmit() {
    if (this.messages === undefined) return;
    this.messageForm.disable();
    if (this.page) this.resetPage();
    const token = this.authService.getToken();
    const text = this.messageForm.get("text")?.value;
    const embed = this.messageForm.get("embed")?.value;
    const formData = new FormData();
    if (text) formData.append("text", text);
    if (embed) formData.append("embed", embed);
    this.httpMessageService.createByUserInChat(this.chat.id, token, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

  protected cancelEditMessage() {
    this.editMessageItem = undefined;
  }

  protected onEditSubmit() {
    const token = this.authService.getToken();
    const newText = this.editMessageForm.get("newText")!.value!;
    this.httpMessageService.updateByAuthor(this.editMessageItem!.id, token, newText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

  protected enableContextMenu(event: MouseEvent, messageDto: MessageDto) {
    if (!this.contextMenuComponent) {
      event.preventDefault();
      this.contextMenuComponent = new ContextMenuComponent();
      this.contextMenuComponent.buttons = [];
      if (messageDto.text) {
        const copyTextSubject = new Subject<void>();
        copyTextSubject.subscribe(() => navigator.clipboard.writeText(messageDto.text!));
        this.contextMenuComponent.buttons.push(new ContextButton("Copy text", copyTextSubject));
      }
      if (messageDto.author.id == this.user.id) {
        const editMessageSubject = new Subject<void>();
        editMessageSubject.subscribe(() => this.startEditMessage(messageDto));
        this.contextMenuComponent.buttons.push(new ContextButton("Edit message", editMessageSubject));
      }
      if (messageDto.author.id == this.user.id || this.user.moderatorAt.includes(this.chat.id)) {
        const deleteMessageSubject = new Subject<void>();
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

  protected isBlocked(userId: number): boolean {
    return this.user.blockedUsers.some(u => u.id === userId);
  }

  protected isMod(userId: number): boolean {
    return this.chat.moderatorsId.includes(userId);
  }

  private disableContextMenu() {
    this.contextMenuComponent = undefined;
  }

  private subscribeGetMessages() {
    this.getMessagesDestroy$.next();
    const token = this.authService.getToken();
    this.httpMessageService.getAll(this.chat.id, token, this.page, this.PAGE_SIZE)
      .pipe(
        repeat({delay: 1000}),
        takeUntil(this.getMessagesDestroy$))
      .subscribe({
        next: (messages) => {
          this.isLastPage = messages.last;
          const newMessages = (messages.content as MessageDto[]).sort((a, b) => b.id - a.id);
          if (JSON.stringify(this.messages) != JSON.stringify(newMessages)) this.messages = newMessages;
        },
        error: (error) => {
          if (error.status === 401) this.authService.logout();
        }
      });
  }

  private startEditMessage(messageDto: MessageDto) {
    this.editMessageItem = messageDto;
    this.editMessageForm.controls["newText"].setValue(messageDto.text ?? '');
  }

  private deleteMessage(messageId: number) {
    const token = this.authService.getToken();
    this.httpMessageService.deleteByAuthorOrMod(messageId, token).subscribe({
      next: () => {
        this.messages!.splice(this.messages!.findIndex(m => m.id === messageId), 1);
      },
      error: (err) => {
        if (err.status == 401) this.authService.logout();
      }
    });
  }
}
