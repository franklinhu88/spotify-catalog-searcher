import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchRow } from '../../../models/search.row.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search-dropdown.component.html',
  styleUrl: './search-dropdown.component.css',
})
export class SearchDropdownComponent {
  @Input() items: SearchRow[] = [];
  @Input() currentType: string = '';

  getRouterLink(item: { id: string }): string {
    switch (this.currentType) {
      case 'album':
        return `/album/${item.id}`;
      case 'track':
        return `/track/${item.id}`;
      case 'artist':
        return `/artist/${item.id}`;
      default:
        return '';
    }
  }
}
