import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackSearchRow } from '../../models/track.search.model';

@Component({
  selector: 'app-search-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-dropdown.component.html',
  styleUrl: './search-dropdown.component.css',
})
export class SearchDropdownComponent {
  @Input() items: TrackSearchRow[] = [];


}
