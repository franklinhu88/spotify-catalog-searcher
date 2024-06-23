import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Track } from '../../models/track.model';
import { Album } from '../../models/album.model';
import { Artist } from '../../models/artist.model';
import { TrackSearchRow } from '../../models/track.search.model';
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
  trackList: TrackSearchRow[] = [];
  isInputFocused: boolean = false;
  currentType: string = 'track';

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
    // 1. Check if the search term is empty
    if (this._searchTerm.trim() === '') {
      this.trackList = [];
    } else {
      // 2. Fetch tracks from the SpotifyService
      const tracks = await this.spotifyService
        .search(this._searchTerm, this.currentType)
        .toPromise();

      // 3. Check if tracks were found
      if (tracks) {
        // 4. Map the fetched tracks to TrackSearchRow objects
        this.trackList = await Promise.all(
          tracks.map(async (track) => {
            // 4.1 Fetch album details using the album ID
            const album = await this.spotifyService
              .getAlbum(track.album)
              .toPromise();
            // 4.2 Fetch artist names using the artist IDs
            const artistNames = await Promise.all(
              track.artists.map(async (artistId) => {
                const artist = await this.spotifyService
                  .getArtist(artistId)
                  .toPromise();
                return artist?.name ?? '';
              })
            );
            
            console.log(JSON.stringify(album));
            return {
              trackName: track.name,
              albumPhoto: album?.imageURL,
              artists: artistNames,
            } as TrackSearchRow;
          })
        );
      } else {
        this.trackList = [];
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
