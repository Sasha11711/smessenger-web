import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ChatDto } from "../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../dto/user/user-info-dto";
import { API_URL } from "../../constants";
import { UserDto } from "../../../dto/user/user-dto";

@Component({
  selector: "app-chats",
  templateUrl: "./chats.component.html",
  styleUrls: ["./chats.component.scss"]
})
export class ChatsComponent {
  protected readonly API_URL = API_URL;
  @Input() user!: UserDto;
  @Input() blocked!: Set<UserInfoDto>;
  @Output() onChatSelected = new EventEmitter<ChatDto>();
}
