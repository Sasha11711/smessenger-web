import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root"
})
export class SettingsService {

  constructor(private cookieService: CookieService) { }

  setColor(property: "dark" | "default" | "light" | "accent", color: string) {
    this.cookieService.set(property, color);
  }

  getColor(property: "dark" | "default" | "light" | "accent") {
    if (this.cookieService.check(property))
      return this.cookieService.get(property);
    return;
  }

  applyTheme() {
    let root = document.documentElement;
    let darkColor = this.getColor("dark");
    let defaultColor = this.getColor("default");
    let lightColor = this.getColor("light");
    let accentColor = this.getColor("accent");
    if (darkColor) root.style.setProperty("--dark-color", darkColor);
    if (defaultColor) root.style.setProperty("--default-color", defaultColor);
    if (lightColor) root.style.setProperty("--light-color", lightColor);
    if (accentColor) root.style.setProperty("--accent-color", accentColor);
  }
}
