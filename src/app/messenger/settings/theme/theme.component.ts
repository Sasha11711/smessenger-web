import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ThemeService } from "../../../../services/theme.service";

@Component({
  selector: "app-theme",
  templateUrl: "./theme.component.html",
  styleUrls: ["./theme.component.scss"]
})
export class ThemeComponent {
  themeForm = new FormGroup({
    dark: new FormControl<string>(this.settingsService.getColor("dark")),
    default: new FormControl<string>(this.settingsService.getColor("default")),
    light: new FormControl<string>(this.settingsService.getColor("light")),
    accent: new FormControl<string>(this.settingsService.getColor("accent"))
  });

  constructor(protected settingsService: ThemeService) { }

  onSubmit() {
    this.settingsService.setColor("dark", this.themeForm.get("dark")!.value!);
    this.settingsService.setColor("default", this.themeForm.get("default")!.value!);
    this.settingsService.setColor("light", this.themeForm.get("light")!.value!);
    this.settingsService.setColor("accent", this.themeForm.get("accent")!.value!);
    this.settingsService.applyTheme();
  }

  reset() {
    this.settingsService.resetTheme();
    this.themeForm.reset({
        dark: this.settingsService.getColor("dark"),
        default: this.settingsService.getColor("default"),
        light: this.settingsService.getColor("light"),
        accent: this.settingsService.getColor("accent")
      }
    );
  }
}
