import { Component } from "@angular/core";
import { ContextMenuService } from "../services/context-menu.service";
import { SettingsService } from "../services/settings.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "SMessenger";

  constructor(protected contextMenuService: ContextMenuService, settingsService: SettingsService) {
    settingsService.applyTheme();
  }
}
