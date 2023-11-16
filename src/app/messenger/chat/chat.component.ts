import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ChatDto } from "../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { MessageDto } from "../../../dto/message/message-dto";
import {UserDto} from "../../../dto/user/user-dto";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit {
  protected readonly PAGE_SIZE = 10;
  @Input() user!: UserDto;
  @Input() chat!: ChatDto;
  @Output() onChatUnselected = new EventEmitter();
  @Output() onSettingsToggled = new EventEmitter();
  isLoading: boolean = false;
  messages?: [MessageDto];
  page: number = 1;

  ngOnInit() {
    console.log(this.chat)
    if (this.chat.lastMessage)
      this.messages = [this.chat.lastMessage]
    //TODO: message getting
  }

  isBlocked(user: UserInfoDto) {
    return this.user.blockedUsers.has(user);
  }
}
