import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchRow } from '../../../models/search.row.model';
import { SpotifyService } from '../../../services/spotify.service';
import { SearchDropdownComponent } from '../search-dropdown/search-dropdown.component';
import { Track } from '../../../models/track.model';
import { Album } from '../../../models/album.model';
import { Artist } from '../../../models/artist.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [FormsModule, SearchDropdownComponent, CommonModule, RouterLink],
})
export class NavBarComponent implements OnInit {
  private _searchTerm: string = '';
  searchResult: SearchRow[] = [];
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
    this.filterResults();
  }

  async filterResults() {
    if (this._searchTerm.trim() === '') {
      this.searchResult = [];
    } else {
      let results: any[] | undefined = await this.spotifyService
        .search(this._searchTerm, this.currentType)
        .toPromise();

      if (results) {
        if (this.currentType === 'track') {
          this.searchResult = await Promise.all(
            (results as Track[]).map(async (track) => {
              const album = await this.spotifyService
                .getAlbum(track.album)
                .toPromise();
              const artistNames = await Promise.all(
                track.artists.map(async (artistId) => {
                  const artist = await this.spotifyService
                    .getArtist(artistId)
                    .toPromise();
                  return artist?.name ?? '';
                })
              );
              return {
                mainText: track.name,
                photo: album?.imageURL,
                subText: artistNames,
                id: track.id,
              } as SearchRow;
            })
          );
        } else if (this.currentType === 'album') {
          this.searchResult = await Promise.all(
            (results as Album[]).map(async (album) => {
              const artistNames = await Promise.all(
                album.artists.map(async (artistId) => {
                  const artist = await this.spotifyService
                    .getArtist(artistId)
                    .toPromise();
                  return artist?.name ?? '';
                })
              );
              return {
                mainText: album.name,
                photo: album.imageURL,
                subText: artistNames,
                id: album.id,
              } as SearchRow;
            })
          );
        } else if (this.currentType === 'artist') {
          this.searchResult = (results as Artist[]).map((artist) => {
            return {
              mainText: artist.name,
              photo: artist.imageUrl,
              subText: [artist.followerCount.toLocaleString()],
              id: artist.id,
            } as SearchRow;
          });
        }
      } else {
        this.searchResult = [];
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
    setTimeout(() => {
      this.isInputFocused = false;
    }, 100);
  }

  onTypeChange(event: Event) {
    this.currentType = (event.target as HTMLSelectElement).value;
    this.filterResults();
  }
}
