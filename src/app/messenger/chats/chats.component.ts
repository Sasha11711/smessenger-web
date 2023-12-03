import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { ChatDto } from "../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { API_URL } from "../../constants";
import { UserDto } from "../../../dto/user/user-dto";
import { Observable, Subject, takeUntil } from "rxjs";
import { ContextButton, ContextMenuComponent } from "../context-menu/context-menu.component";
import { HttpChatService } from "../../../services/http-chat.service";
import { AuthService } from "../../../services/auth.service";
import { ContextMenuService } from "../../../services/context-menu.service";
import { ChatInfoDto } from "../../../dto/chat/chat-info-dto";

@Component({
  selector: "app-chats",
  templateUrl: "./chats.component.html"
})
export class ChatsComponent implements OnDestroy {
  @Input() user!: UserDto;
  @Input() blocked!: UserInfoDto[];
  @Output() onChatSelected = new EventEmitter<ChatDto>();
  @Output() onChatLeft = new EventEmitter<number>();
  protected readonly API_URL = API_URL;
  protected contextMenuComponent?: ContextMenuComponent;
  private destroy$ = new Subject<void>();

  constructor(private httpChatService: HttpChatService, private authService: AuthService, contextMenuService: ContextMenuService) {
    contextMenuService.subject
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.disableContextMenu());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected enableContextMenu(event: MouseEvent, chat: ChatInfoDto) {
    if (!this.contextMenuComponent) {
      event.preventDefault();
      this.contextMenuComponent = new ContextMenuComponent();
      const leaveChatSubject = new Subject<void>();
      leaveChatSubject.subscribe(() => this.leaveChat(chat.id));
      this.contextMenuComponent.buttons = [new ContextButton("Leave chat", leaveChatSubject)];
      if (this.user.moderatorAt.includes(chat.id)) {
        const deleteChatSubject = new Subject<void>();
        deleteChatSubject.subscribe(() => this.deleteChat(chat.id));
        this.contextMenuComponent.buttons.push(new ContextButton("Delete chat", deleteChatSubject));
      }
      this.contextMenuComponent.title = `${chat.id}. ${chat.title}`;
      this.contextMenuComponent.x = event.clientX;
      this.contextMenuComponent.y = event.clientY;
    } else this.disableContextMenu();
  }

  private leaveChat(chatId: number) {
    const token = this.authService.getToken();
    this.handleLeaveUser(this.httpChatService.leaveUser(chatId, token), chatId);
  }

  private deleteChat(chatId: number) {
    const token = this.authService.getToken();
    this.handleLeaveUser(this.httpChatService.deleteByMod(chatId, token), chatId);
  }

  private handleLeaveUser(observable: Observable<Object>, chatId: number) {
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.onChatLeft.emit(chatId);
      },
      error: (error: any) => {
        if (error.status === 401) this.authService.logout();
      }
    });
  }

  private disableContextMenu() {
    this.contextMenuComponent = undefined;
  }
}
