import { ChatDto } from "../chat/chat-dto";
import { UserInfoDto } from "./user-info-dto";

export class UserDto {
  username!: string;
  avatarId!: number;

  chats!: ChatDto[];
  moderatorAt!: number[];

  friends!: UserInfoDto[];
  friendRequests!: UserInfoDto[];
  friendRequestedBy!: UserInfoDto[];
  blockedUsers!: UserInfoDto[];
}
