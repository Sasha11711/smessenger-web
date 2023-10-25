import { Component, Input, OnInit } from '@angular/core';
import { ChatDto } from "../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { MessageDto } from "../../../dto/message/message-dto";
import { BLOCKED_USER_TEXT } from "../../constants";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss', '../flex-container.scss']
})
export class ChatComponent {
  @Input() chat?: ChatDto;
  @Input() blocked!: Set<UserInfoDto>;
  BLOCKED_USER_TEXT = BLOCKED_USER_TEXT;

  getAvatarUrl(user: UserInfoDto): URL {
    if (!user.avatar)
      return new URL("assets/icon.svg");
    return new URL(URL.createObjectURL(user.avatar));
  }

  getEmbedUrl(message: MessageDto): URL | void {
    if (message.embedImage)
      return new URL(URL.createObjectURL(message.embedImage));
  }

  isBlocked(user: UserInfoDto): boolean {
    return this.blocked.has(user);
  }
}
