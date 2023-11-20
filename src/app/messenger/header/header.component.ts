import { Component, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() leftButton!: HeaderButton
  @Input() rightButtons?: HeaderButton[]
}

export class HeaderButton {
  imageURL!: string;
  link?: string;
  event?: EventEmitter<void>;
}
