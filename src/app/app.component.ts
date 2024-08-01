import { Component, OnInit } from '@angular/core';
import { SpotifyService } from './services/spotify.service';
import { NavBarComponent } from './components/top-bar/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Track } from './models/track.model';
import { Album } from './models/album.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, NavBarComponent, FormsModule, RouterModule],
})
export class AppComponent implements OnInit {
  trackId: string = '';
  showSong: boolean = false;
  artist: any;
  accessToken: string = '';

  constructor(private spotifyService: SpotifyService) {}

  async ngOnInit() {
    this.accessToken = await this.spotifyService.getAccessToken();
  }

  onTrackIdSubmit() {
    this.showSong = true;
  }
}
