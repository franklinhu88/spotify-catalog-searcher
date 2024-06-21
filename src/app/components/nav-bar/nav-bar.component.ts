import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchDropdownComponent } from '../search-dropdown/search-dropdown.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [FormsModule, SearchDropdownComponent, CommonModule],
})
export class NavBarComponent {
  private _searchTerm: string = '';
  filteredTracks: string[] = [];
  isInputFocused: boolean = false;

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filterTracks();
  }

  filterTracks() {
    // Assuming you have a list of all tracks
    const allTracks = [
      'Track 1',
      'Track 2',
      'Track 3',
      'Track 4',
      'Hello Pand',
      'Bai Hello',
      'Two three',
    ];
    this.filteredTracks = allTracks.filter((track) =>
      track.toLowerCase().includes(this._searchTerm.toLowerCase())
    );
  }

  onSearch() {
    console.log('Search term:', this._searchTerm);
    // You can perform further actions here, such as saving the searchTerm to a service or performing a search operation.
  }

  onFocus() {
    this.isInputFocused = true;
    console.log('Input is focused');
  }

  onBlur() {
    this.isInputFocused = false;
    console.log('Input is not focused');
  }
}
