// src/app/song/song.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-song-card',
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.css'],
})
export class SongCardComponent implements OnInit {
  @Input() trackId: string | null = null;
  song: any;

  constructor(private spotifyService: SpotifyService) {}

  async ngOnInit() {
    if (this.trackId) {
      this.song = await this.spotifyService.getTrack(this.trackId);
    }
  }
}
