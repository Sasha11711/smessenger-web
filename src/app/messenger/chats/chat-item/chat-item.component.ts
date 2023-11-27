import { Component, Input } from "@angular/core";
import { ChatDto } from "../../../../dto/chat/chat-dto";
import { API_URL, BLOCKED_USER_TEXT, IMAGE_MESSAGE_TEXT } from "../../../constants";
import { MessageDto } from "../../../../dto/message/message-dto";
import { UserInfoDto } from "../../../../dto/user/user-info-dto";

@Component({
  selector: "app-chat-item",
  templateUrl: "./chat-item.component.html",
  styleUrls: ["./chat-item.component.scss"]
})
export class ChatItemComponent {
  protected readonly API_URL = API_URL;
  @Input() chat!: ChatDto;
  @Input() blockedUsers!: UserInfoDto[];

  getText(message: MessageDto) {
    if (this.blockedUsers.find(user => user.id === message.author.id))
      return BLOCKED_USER_TEXT
    let text = message.text?.length! > 12 ? message.text?.slice(0, 12) + "..." : message.text;
    return text || IMAGE_MESSAGE_TEXT
  }
}
