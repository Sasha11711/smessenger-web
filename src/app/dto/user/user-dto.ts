import { ChatDto } from "../chat/chat-dto";
import { UserInfoDto } from "./user-info-dto";

export class UserDto {
  username!: string;

  chats!: Set<ChatDto>;
  moderatorAt!: Set<number>;

  friends!: Set<UserInfoDto>;
  friendRequests!: Set<UserInfoDto>;
  friendRequestedBy!: Set<UserInfoDto>;
  blockedUsers!: Set<UserInfoDto>;
}
