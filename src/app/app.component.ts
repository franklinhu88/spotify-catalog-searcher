import { Component, OnInit } from '@angular/core';
import { SpotifyService } from './services/spotify.service';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    this.spotifyService.getArtist(this.pracID).subscribe((artist) => {
      this.artist = artist;
      console.log(this.artist.name);
    });
  }

  onTrackIdSubmit() {
    this.showSong = true;
  }
}
