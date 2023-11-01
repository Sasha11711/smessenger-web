import {Component, Input} from '@angular/core';
import {MessageDto} from "../../../../dto/message/message-dto";
import {API_URL, BLOCKED_USER_TEXT} from "../../../constants";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  protected readonly BLOCKED_USER_TEXT = BLOCKED_USER_TEXT;
  @Input() isBlocked!: boolean;
  @Input() message!: MessageDto;

  getEmbedUrl(): URL | void {
    if (!this.isBlocked)
      return new URL(`${API_URL}/message/${this.message.id}/embed`);
  }

  getAvatarUrl() {
    if (this.isBlocked)
      return new URL("assets/icon.svg");
    return new URL(`${API_URL}/user/${this.message.author.id}/avatar`);
  }
}
