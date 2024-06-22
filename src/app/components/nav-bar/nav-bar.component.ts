import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpotifyService } from '../../services/spotify.service';
import { SearchDropdownComponent } from '../search-dropdown/search-dropdown.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [FormsModule, SearchDropdownComponent, CommonModule],
})
export class NavBarComponent implements OnInit {
  private _searchTerm: string = '';
  filteredTracks: string[] = [];
  isInputFocused: boolean = false;

  constructor(private spotifyService: SpotifyService) {}

  async ngOnInit() {
    await this.spotifyService.getAccessToken();
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filterTracks();
  }

  async filterTracks() {
    if (this._searchTerm.trim() === '') {
      this.filteredTracks = [];
    } else {
      const tracks = await this.spotifyService
        .searchTracks(this._searchTerm)
        .toPromise();
      if (tracks) {
        this.filteredTracks = tracks.map((track) => track.name);
      } else {
        this.filteredTracks = [];
      }
    }
  }

  onSearch() {
    console.log('Search term:', this._searchTerm);
  }

  onFocus() {
    this.isInputFocused = true;
  }

  onBlur() {
    this.isInputFocused = false;
  }
}
