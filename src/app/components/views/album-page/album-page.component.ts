import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Album } from '../../../models/album.model';
import { SpotifyService } from '../../../services/spotify.service';
import { Artist } from '../../../models/artist.model';
import { Track } from '../../../models/track.model';

@Component({
  selector: 'app-album-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css'],
})
export class AlbumPage implements OnInit {
  albumId: string = '';
  album: Album | undefined;
  artistNames: string[] = [];
  tracks: Track[] = [];

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    // Subscribe to route parameters to get the albumId from the URL
    this.route.paramMap.subscribe((params) => {
      this.albumId = params.get('id') || '';
      if (this.albumId) {
        this.fetchAlbum();
      }
    });
  }

  fetchAlbum() {
    this.spotifyService.getAlbum(this.albumId).subscribe(
      (album) => {
        this.album = album;
        this.fetchArtists(album.artists);
        this.fetchTracks(album.tracks);
        console.log(this.album);
      },
      (error) => {
        console.error('Error fetching album:', error);
      }
    );
  }

  fetchArtists(artistIds: string[]) {
    this.artistNames = [];
    artistIds.forEach((id) => {
      this.spotifyService.getArtist(id).subscribe(
        (artist: Artist) => {
          this.artistNames.push(artist.name);
        },
        (error) => {
          console.error('Error fetching artist:', error);
        }
      );
    });
  }

  fetchTracks(trackIds: string[]) {
    this.tracks = [];
    trackIds.forEach((id) => {
      this.spotifyService.getTrack(id).subscribe(
        (track: Track) => {
          this.tracks.push(track);
        },
        (error) => {
          console.error('Error fetching track:', error);
        }
      );
    });
  }

  getPopularityDescription(popularity: number): string {
    if (popularity >= 80) return '🔥 On fire';
    if (popularity >= 60) return '✨ Trending';
    if (popularity >= 40) return '👌 Pretty decent';
    if (popularity >= 20) return '🤷‍♂️ Kinda meh';
    return '🦗 Crickets... not popular';
  }
}
