import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { UserDto } from "../../../../dto/user/user-dto";
import { HttpUserService } from "../../../../services/http-user.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../../services/auth.service";
import { API_URL } from "../../../constants";
import { Subject } from "rxjs";

@Component({
  selector: "app-update-user",
  templateUrl: "./update-user.component.html"
})
export class UpdateUserComponent implements OnInit, OnDestroy {
  @Input() user!: UserDto;
  protected avatarURL?: string;
  protected updateForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.maxLength(255)]),
    avatar: new FormControl<Blob | null>(null)
  });
  private destroy$ = new Subject<void>();

  constructor(private httpUserService: HttpUserService, private authService: AuthService) { }

  ngOnInit() {
    this.updateForm.controls["username"].setValue(this.user.username);
    this.avatarURL = `${API_URL}/image/${this.user.avatarId}`;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected setAvatar(event: any) {
    if (event.target.value) {
      const file = event.target.files[0];
      this.updateForm.controls["avatar"].setValue(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.avatarURL = reader.result as string;
    } else {
      this.updateForm.controls["avatar"].setValue(null);
      this.avatarURL = `${API_URL}/image/${this.user.avatarId}`;
    }
  }

  protected onSubmit() {
    this.updateForm.disable();
    const token = this.authService.getToken();
    const username = this.updateForm.get("username")!.value!;
    const image = this.updateForm.get("avatar")?.value;
    const formData = new FormData();
    formData.append("username", username);
    if (image) formData.append("avatar", image);
    this.httpUserService.update(token, formData)
      .subscribe({
        next: () => {
          this.user.username = username;
          this.updateForm.enable();
        },
        error: () => {
          this.updateForm.enable();
        }
      });
  }
}
