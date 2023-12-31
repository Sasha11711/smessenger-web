import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root"
})
export class ThemeService {
  readonly defaultColors;

  constructor(private cookieService: CookieService) {
    const rootStyle = getComputedStyle(document.documentElement);
    this.defaultColors = {
      dark: rootStyle.getPropertyValue("--dark-color"),
      default: rootStyle.getPropertyValue("--default-color"),
      light: rootStyle.getPropertyValue("--light-color"),
      accent: rootStyle.getPropertyValue("--accent-color")
    }
  }

  setColor(property: "dark" | "default" | "light" | "accent", color: string) {
    this.cookieService.set(property, color);
  }

  getColor(property: "dark" | "default" | "light" | "accent"): string {
    if (this.cookieService.check(property)) return this.cookieService.get(property);
    return this.defaultColors[property];
  }

  applyTheme() {
    const root = document.documentElement;
    const darkColor = this.getColor("dark");
    const defaultColor = this.getColor("default");
    const lightColor = this.getColor("light");
    const accentColor = this.getColor("accent");
    if (darkColor) root.style.setProperty("--dark-color", darkColor);
    if (defaultColor) root.style.setProperty("--default-color", defaultColor);
    if (lightColor) root.style.setProperty("--light-color", lightColor);
    if (accentColor) root.style.setProperty("--accent-color", accentColor);
  }

  resetTheme() {
    this.cookieService.delete("dark");
    this.cookieService.delete("default");
    this.cookieService.delete("light");
    this.cookieService.delete("accent");
    this.applyTheme();
  }
}
