export class UserInfoDto {
  id!: number;

  username!: String;
  avatar?: Blob;
  registrationInstant!: Date;
  isDeactivated!: Boolean;
}
