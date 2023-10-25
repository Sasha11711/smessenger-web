import { Component, Input } from '@angular/core';
import { ChatDto } from "../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { MessageDto } from "../../../dto/message/message-dto";
import {API_URL, BLOCKED_USER_TEXT} from "../../constants";
import {UserDto} from "../../../dto/user/user-dto";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss', '../flex-container.scss']
})
export class ChatComponent {
  protected readonly API_URL = API_URL;
  protected readonly BLOCKED_USER_TEXT = BLOCKED_USER_TEXT;
  @Input() user!: UserDto;
  @Input() chat?: ChatDto;

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
