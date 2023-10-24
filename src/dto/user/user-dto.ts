import { ChatDto } from "../chat/chat-dto";
import { ChatInfoDto } from "../chat/chat-info-dto";
import { UserInfoDto } from "./user-info-dto";

export class UserDto {
  id!: number;
  uuid!: string;

  username!: String;
  avatar?: Blob;
  registrationInstant!: Date;
  isDeactivated!: Boolean;

  chats!: Set<ChatDto>;
  moderatorAt!: Set<ChatInfoDto>;
  bannedAt!: Set<ChatInfoDto>;

  friends!: Set<UserInfoDto>;
  friendRequests!: Set<UserInfoDto>;
  friendRequestedBy!: Set<UserInfoDto>;
  blockedUsers!: Set<UserInfoDto>;
  blockedBy!: Set<UserInfoDto>;
}
