import { ChatInfoDto } from "../chat/chat-info-dto";
import { UserInfoDto } from "../user/user-info-dto";

export class MessageDto {
  id!: number;

  text?: string;
  sentInstant!: Date;
  isEdited!: boolean;
  embedImage?: Blob;

  chat!: ChatInfoDto;
  author!: UserInfoDto;
}
