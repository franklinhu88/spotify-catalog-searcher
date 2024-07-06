import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Track } from '../../../models/track.model';
import { Album } from '../../../models/album.model';
import { Artist } from '../../../models/artist.model';
import { SpotifyService } from '../../../services/spotify.service';

@Component({
  selector: 'app-track-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './track-page.component.html',
  styleUrls: ['./track-page.component.css'],
})
export class TrackPage implements OnInit {
  trackId: string = '';
  track: Track | undefined;
  album: Album | undefined;
  artists: Artist[] = [];

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
        this.fetchAlbum(track.album);
        this.fetchArtists(track.artists);
      },
      (error) => {
        console.error('Error fetching track:', error);
      }
    );
  }

  fetchAlbum(albumId: string) {
    this.spotifyService.getAlbum(albumId).subscribe(
      (album) => {
        this.album = album;
      },
      (error) => {
        console.error('Error fetching album:', error);
      }
    );
  }

  fetchArtists(artistIds: string[]) {
    const artistObservables = artistIds.map((id) =>
      this.spotifyService.getArtist(id).toPromise()
    );

    Promise.all(artistObservables).then(
      (artists) => {
        this.artists = artists.filter((artist): artist is Artist => !!artist);
      },
      (error) => {
        console.error('Error fetching artists:', error);
      }
    );
  }

  getPopularityDescription(popularity: number): string {
    if (popularity >= 80) return '🔥 On fire';
    if (popularity >= 60) return '✨ Trending';
    if (popularity >= 40) return '👌 Pretty decent';
    if (popularity >= 20) return '🤷‍♂️ Kinda meh';
    return '🦗 Crickets... not popular';
  }
}
