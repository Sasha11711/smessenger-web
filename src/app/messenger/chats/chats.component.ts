import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatDto } from "../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import {API_URL, BLOCKED_USER_TEXT, IMAGE_MESSAGE_TEXT} from "../../constants";
import {UserDto} from "../../../dto/user/user-dto";
import {MessageDto} from "../../../dto/message/message-dto";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss', '../flex-container.scss']
})
export class ChatsComponent {
  protected readonly API_URL = API_URL;
  @Input() user!: UserDto;
  @Input() blocked!: Set<UserInfoDto>;
  @Output() onChatSelected = new EventEmitter<ChatDto>();

  getImageUrl(imageBlob?: Blob): string {
    if (!imageBlob)
      return "assets/icon.svg";
    return URL.createObjectURL(imageBlob);
  }

  getText(message: MessageDto): string {
    if (this.user.blockedUsers.has(message.author))
      return BLOCKED_USER_TEXT
    return message.text || IMAGE_MESSAGE_TEXT
  }
}
