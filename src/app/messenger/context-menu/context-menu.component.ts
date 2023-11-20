import { Component, Input } from '@angular/core';
import { Subject } from "rxjs";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {
  @Input() x = 0;
  @Input() y = 0;
  @Input() buttons?: ContextButton[];
}

export class ContextButton {
  text!: string;
  event!: Subject<void>;

  constructor(text: string, event: Subject<void>) {
    this.text = text;
    this.event = event;
  }
}
