import { Component, OnInit } from '@angular/core';
import { SpotifyService } from './services/spotify.service';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Track } from './models/track.model';
import { Album } from './models/album.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, NavBarComponent, FormsModule],
})
export class AppComponent implements OnInit {
  trackId: string = '';
  showSong: boolean = false;
  pracID: string = '4Z8W4fKeB5YxbusRsdQVPb';
  artist: any;
  accessToken: string = '';

  constructor(private spotifyService: SpotifyService) {}

  async ngOnInit() {
    this.accessToken = await this.spotifyService.getAccessToken();
  }

  onTrackIdSubmit() {
    this.showSong = true;
  }

  testSearchTracks() {
    this.spotifyService.getAlbum('1JzjwUKkPsdHg1SQ7qa5hc').subscribe(
      (album: Album) => {
        console.log('Search Tracks Result:', album);
      },
      (error) => {
        console.error('Error fetching search tracks:', error);
      }
    );
  }
}
