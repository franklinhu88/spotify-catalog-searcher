import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchRow } from '../../models/search.row.model';
import { SpotifyService } from '../../services/spotify.service';
import { SearchDropdownComponent } from '../search-dropdown/search-dropdown.component';
import { Track } from '../../models/track.model';
import { Album } from '../../models/album.model';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [FormsModule, SearchDropdownComponent, CommonModule],
})
export class NavBarComponent implements OnInit {
  private _searchTerm: string = '';
  searchResult: SearchRow[] = [];
  isInputFocused: boolean = false;
  currentType: string = 'track';
  activeButton: string = 'track';

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

      console.log('Filter results: ' + results);

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
              } as SearchRow;
            })
          );
        } else if (this.currentType === 'artist') {
          this.searchResult = (results as Artist[]).map((artist) => {
            return {
              mainText: artist.name,
              photo: artist.imageUrl,
              subText: [artist.followerCount.toLocaleString()],
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
    this.isInputFocused = false;
  }

  setActiveButton(button: string) {
    this.activeButton = button;
    this.currentType = button;
    this.filterResults();
  }
}
