import { Component, Input } from '@angular/core';
import { ChatDto } from "../../../dto/chat/chat-dto";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss', '../header.scss']
})
export class ChatComponent {
  @Input() chat!: ChatDto;
}
