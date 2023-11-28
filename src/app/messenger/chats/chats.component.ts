import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ChatDto } from "../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { API_URL } from "../../constants";
import { UserDto } from "../../../dto/user/user-dto";
import { Observable, Subject } from "rxjs";
import { ContextButton, ContextMenuComponent } from "../context-menu/context-menu.component";
import { HttpChatService } from "../../../services/http-chat.service";
import { AuthService } from "../../../services/auth.service";
import { ContextMenuService } from "../../../services/context-menu.service";
import { ChatInfoDto } from "../../../dto/chat/chat-info-dto";

@Component({
  selector: "app-chats",
  templateUrl: "./chats.component.html",
  styleUrls: ["./chats.component.scss"]
})
export class ChatsComponent {
  protected readonly API_URL = API_URL;
  @Input() user!: UserDto;
  @Input() blocked!: UserInfoDto[];
  @Output() onChatSelected = new EventEmitter<ChatDto>();
  @Output() onChatLeft = new EventEmitter<number>();
  contextMenuComponent?: ContextMenuComponent;

  constructor(private httpChatService: HttpChatService, private authService: AuthService, contextMenuService: ContextMenuService) {
    contextMenuService.subject.subscribe(() => this.disableContextMenu());
  }

  leaveChat(chatId: number) {
    let token = this.authService.getToken();
    this.subscribeLeaveUser(this.httpChatService.leaveUser(chatId, token), chatId);
  }

  deleteChat(chatId: number) {
    let token = this.authService.getToken();
    this.subscribeLeaveUser(this.httpChatService.deleteByMod(chatId, token), chatId);
  }

  subscribeLeaveUser(observable: Observable<Object>, chatId: number) {
    observable.subscribe({
      next: () => {
        this.onChatLeft.emit(chatId);
      },
      error: (error: any) => {
        if (error.status === 401) this.authService.logout();
      }
    });
  }

  enableContextMenu(event: MouseEvent, chat: ChatInfoDto) {
    if (!this.contextMenuComponent) {
      event.preventDefault();
      this.contextMenuComponent = new ContextMenuComponent();
      let leaveChatSubject = new Subject<void>();
      leaveChatSubject.subscribe(() => this.leaveChat(chat.id));
      this.contextMenuComponent.buttons = [new ContextButton("Leave chat", leaveChatSubject)];
      if (this.user.moderatorAt.includes(chat.id)) {
        let deleteChatSubject = new Subject<void>();
        deleteChatSubject.subscribe(() => this.deleteChat(chat.id));
        this.contextMenuComponent.buttons.push(new ContextButton("Delete chat", deleteChatSubject));
      }
      this.contextMenuComponent.title = `${chat.id}. ${chat.title}`;
      this.contextMenuComponent.x = event.clientX;
      this.contextMenuComponent.y = event.clientY;
    }
  }

  disableContextMenu() {
    this.contextMenuComponent = undefined;
  }
}
