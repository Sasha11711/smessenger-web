import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ChatDto } from "../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { API_URL } from "../../constants";
import { UserDto } from "../../../dto/user/user-dto";
import { Subject } from "rxjs";
import { ContextButton } from "../context-menu/context-menu.component";

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
  contextMenu = false;
  contextX = 0;
  contextY = 0;
  contextButtons?: ContextButton[];

  leaveChat(chatId: number) {
    this.disableContextMenu();
    //TODO: leave chat call
  }

  deleteChat(chatId: number) {
    this.disableContextMenu();
    //TODO: delete chat call
  }

  enableContextMenu(event: any, chatId: number) {
    event.preventDefault();
    let leaveChatSubject = new Subject<void>();
    leaveChatSubject.subscribe(() => this.leaveChat(chatId));
    this.contextButtons = [new ContextButton("Leave chat", leaveChatSubject)];
    if (this.user.moderatorAt.includes(chatId)) {
      let deleteChatSubject = new Subject<void>();
      deleteChatSubject.subscribe(() => this.deleteChat(chatId));
      this.contextButtons.push(new ContextButton("Leave chat", leaveChatSubject));
    }
    this.contextX = event.clientX;
    this.contextY = event.clientY;
    this.contextMenu = true;
  }

  disableContextMenu() {
    this.contextMenu = false;
  }
}
