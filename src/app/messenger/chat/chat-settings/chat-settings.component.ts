import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from "../../../../dto/user/user-dto";
import { ChatDto } from "../../../../dto/chat/chat-dto";

@Component({
  selector: 'app-chat-settings',
  templateUrl: './chat-settings.component.html',
  styleUrls: ['./chat-settings.component.scss']
})
export class ChatSettingsComponent {
  @Input() user!: UserDto;
  @Input() chat!: ChatDto;
  @Output() onSettingsToggled = new EventEmitter();
}
