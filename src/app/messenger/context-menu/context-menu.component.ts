import { Component, Input } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-context-menu",
  templateUrl: "./context-menu.component.html",
  styleUrls: ["./context-menu.component.scss"]
})
export class ContextMenuComponent {
  @Input() x = 0;
  @Input() y = 0;
  @Input() buttons?: ContextButton[];
  @Input() title?: string;

  protected getX() {
    return this.x + 150 > window.innerWidth ? this.x - 150 : this.x;
  }

  protected getY() {
    return this.y + 150 > window.innerHeight ? this.y - 150 : this.y;
  }
}

export class ContextButton {
  text!: string;
  event!: Subject<void>;

  constructor(text: string, event: Subject<void>) {
    this.text = text;
    this.event = event;
  }
}
