import { Component, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() leftButton!: {imageURL: string, link?: string, event?: EventEmitter<any>}
  @Input() rightButtons?: {imageURL: string, link?: string, event?: EventEmitter<any>}[]
}
