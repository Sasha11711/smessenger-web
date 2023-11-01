import { Component, Input } from '@angular/core';
import { ChatDto } from "../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { MessageDto } from "../../../dto/message/message-dto";
import {UserDto} from "../../../dto/user/user-dto";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss', '../flex-container.scss']
})
export class ChatComponent {
  protected readonly PAGE_SIZE = 10;
  @Input() user!: UserDto;
  @Input() chat!: ChatDto;
  isLoading: boolean = false;
  messages: [MessageDto] = [this.chat.lastMessage];
  page: number = 1;

  isBlocked(user: UserInfoDto): boolean {
    return this.user.blockedUsers.has(user);
  }
}
