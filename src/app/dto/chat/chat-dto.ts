import { MessageDto } from "../message/message-dto";
import { UserInfoDto } from "../user/user-info-dto";

export class ChatDto {
  id!: number;

  title!: string;
  chatImage?: Blob;
  creationInstant!: Date;

  messages!: Set<MessageDto>;
  users!: Set<UserInfoDto>;
  moderators!: Set<UserInfoDto>;
  bannedUsers!: Set<UserInfoDto>;
}
