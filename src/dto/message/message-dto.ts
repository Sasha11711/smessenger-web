import { ChatInfoDto } from "../chat/chat-info-dto";
import { UserInfoDto } from "../user/user-info-dto";

export class MessageDto {
  id!: number;

  text?: string;
  sentInstant!: Date;
  isEdited!: boolean;

  chatId!: number;
  author!: UserInfoDto;
}
