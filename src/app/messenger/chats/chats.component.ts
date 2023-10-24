import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatDto } from "../../../dto/chat/chat-dto";
import { MessageDto } from "../../../dto/message/message-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { BLOCKED_USER_TEXT } from "../../constants";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss', '../flex-container.scss']
})
export class ChatsComponent {
  @Input() chats!: Set<ChatDto>;
  @Input() blocked!: Set<UserInfoDto>;
  @Output() onChatSelected = new EventEmitter<ChatDto>();

  getImageUrl(imageBlob?: Blob): string {
    if (!imageBlob)
      return "assets/icon.svg";
    return URL.createObjectURL(imageBlob);
  }

  getLastMessage(messages: Set<MessageDto>): MessageDto | void {
    if (messages.size) {
      let lastMessage: MessageDto;
      messages.forEach((message) => {
        if (lastMessage && message.id > lastMessage.id)
          lastMessage = message;
      });
      if (this.blocked.has(lastMessage!.author))
        lastMessage!.text = BLOCKED_USER_TEXT
    }
  }
}
