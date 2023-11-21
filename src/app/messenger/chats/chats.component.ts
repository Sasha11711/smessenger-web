import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ChatDto } from "../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { API_URL } from "../../constants";
import { UserDto } from "../../../dto/user/user-dto";
import { Observable, Subject } from "rxjs";
import { ContextButton } from "../context-menu/context-menu.component";
import { HttpChatService } from "../../../services/http-chat.service";
import { AuthService } from "../../../services/auth.service";
import { ContextMenuService } from "../../../services/context-menu.service";

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
  contextMenu = false;
  contextX = 0;
  contextY = 0;
  contextButtons?: ContextButton[];

  constructor(private httpChatService: HttpChatService, private authService: AuthService, contextMenuService: ContextMenuService) {
    contextMenuService.subject.subscribe(() => this.disableContextMenu());
  }

  leaveChat(chatId: number) {
    this.disableContextMenu();
    let token = this.authService.getToken();
    this.subscribeLeaveUser(this.httpChatService.leaveUser(chatId, token), chatId);
  }

  deleteChat(chatId: number) {
    this.disableContextMenu();
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

  enableContextMenu(event: any, chatId: number) {
    event.preventDefault();
    let leaveChatSubject = new Subject<void>();
    leaveChatSubject.subscribe(() => this.leaveChat(chatId));
    this.contextButtons = [new ContextButton("Leave chat", leaveChatSubject)];
    if (this.user.moderatorAt.includes(chatId)) {
      let deleteChatSubject = new Subject<void>();
      deleteChatSubject.subscribe(() => this.deleteChat(chatId));
      this.contextButtons.push(new ContextButton("Delete chat", deleteChatSubject));
    }
    this.contextX = event.clientX;
    this.contextY = event.clientY;
    this.contextMenu = true;
  }

  disableContextMenu() {
    this.contextMenu = false;
  }
}
