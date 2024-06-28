import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Track } from '../../../models/track.model';
import { SpotifyService } from '../../../services/spotify.service';

@Component({
  selector: 'app-track-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-page.component.html',
  styleUrls: ['./track-page.component.css'], // Note: Use `styleUrls` instead of `styleUrl`
})
export class TrackPage implements OnInit {
  trackId: string = '';
  track: Track | undefined;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    // Subscribe to route parameters to get the trackId from the URL
    this.route.paramMap.subscribe((params) => {
      this.trackId = params.get('id') || '';
      if (this.trackId) {
        this.fetchTrack();
      }
    });
  }

  fetchTrack() {
    this.spotifyService.getTrack(this.trackId).subscribe(
      (track) => {
        this.track = track;
      },
      (error) => {
        console.error('Error fetching track:', error);
      }
    );
  }
}
