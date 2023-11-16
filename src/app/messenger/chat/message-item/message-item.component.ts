import {Component, Input} from "@angular/core";
import {MessageDto} from "../../../../dto/message/message-dto";
import {API_URL, BLOCKED_USER_TEXT} from "../../../constants";

@Component({
  selector: "app-message-item",
  templateUrl: "./message-item.component.html",
  styleUrls: ["./message-item.component.scss"]
})
export class MessageItemComponent {
  protected readonly API_URL = API_URL;
  protected readonly BLOCKED_USER_TEXT = BLOCKED_USER_TEXT;
  @Input() isBlocked!: boolean;
  @Input() message!: MessageDto;
}