import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UserDto } from "../../../../dto/user/user-dto";
import { ChatDto } from "../../../../dto/chat/chat-dto";
import { UserInfoDto } from "../../../../dto/user/user-info-dto";
import { ContextMenuComponent } from "../../context-menu/context-menu.component";
import { ContextMenuService } from "../../../../services/context-menu.service";

@Component({
  selector: "app-chat-settings",
  templateUrl: "./chat-settings.component.html",
  styleUrls: ["./chat-settings.component.scss"]
})
export class ChatSettingsComponent {
  @Input() user!: UserDto;
  @Input() chat!: ChatDto;
  @Output() onSettingsToggled = new EventEmitter();
  contextMenuComponent?: ContextMenuComponent;
  tab = 0;

  constructor(contextMenuService: ContextMenuService) {
    contextMenuService.subject.subscribe(() => this.disableContextMenu());
  }

  getFriends(): UserInfoDto[] {
    return this.chat.users.filter(user =>
      !this.chat.users.find(value => value.id === user.id) &&
      !this.chat.bannedUsers.find(value => value.id === user.id)
    );
  }

  userContextMenu(event: MouseEvent, chatUser: UserInfoDto) {
    //TODO: implement
  }

  addContextMenu(event: MouseEvent, chatUser: UserInfoDto) {
    //TODO: implement
  }

  bannedContextMenu(event: MouseEvent, chatUser: UserInfoDto) {
    //TODO: implement
  }

  disableContextMenu() {
    this.contextMenuComponent = undefined;
  }
}
