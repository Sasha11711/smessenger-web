import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatDto } from "../../../dto/chat/chat-dto";
import { MessageDto } from "../../../dto/message/message-dto";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss', '../header.scss']
})
export class ChatsComponent {
  @Input() chats!: Set<ChatDto>;
  @Output() onChatSelected = new EventEmitter<ChatDto>();

  getImageUrl(imageBlob?: Blob): URL | void {
    if (!imageBlob)
      return new URL("assets/icon.svg");
    return new URL(URL.createObjectURL(imageBlob));
  }

  getLastMessage(messages?: Set<MessageDto>): MessageDto | void {
    if (messages) {
      let lastMessage: MessageDto;
      messages.forEach((element) => {
        if (element.id > lastMessage?.id) {

        }
      })
    }
  }
}
