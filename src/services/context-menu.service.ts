import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  public subject = new Subject<void>();

  disableContextMenu() {
    this.subject.next();
  }
}
