import { MessageDto } from "../message/message-dto";
import { UserInfoDto } from "../user/user-info-dto";

export class ChatDto {
  id!: number;

  title!: string;
  imageId!: number;

  lastMessage!: MessageDto;
  users!: UserInfoDto[];
  moderatorsId!: number[];
  bannedUsers!: UserInfoDto[];
}
