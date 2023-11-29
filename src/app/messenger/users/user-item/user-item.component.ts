import { Component, Input } from "@angular/core";
import { UserInfoDto } from "../../../../dto/user/user-info-dto";
import { API_URL } from "../../../constants";

@Component({
  selector: "app-user-item",
  templateUrl: "./user-item.component.html",
  styleUrls: ["./user-item.component.scss"]
})
export class UserItemComponent {
  @Input() user!: UserInfoDto;
  protected readonly API_URL = API_URL;
}
