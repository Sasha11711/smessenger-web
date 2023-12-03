import { Component } from "@angular/core";
import { ContextMenuService } from "../services/context-menu.service";
import { ThemeService } from "../services/theme.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "SMessenger";

  constructor(protected contextMenuService: ContextMenuService, settingsService: ThemeService) {
    settingsService.applyTheme();
  }
}
