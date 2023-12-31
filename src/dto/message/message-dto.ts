import { UserInfoDto } from "../user/user-info-dto";
import {ChatInfoDto} from "../chat/chat-info-dto";

export class MessageDto {
  id!: number;

  text?: string;
  embedId?: number;
  sentInstant!: Date;
  isEdited!: boolean;

  chat!: ChatInfoDto;
  author!: UserInfoDto;
}
