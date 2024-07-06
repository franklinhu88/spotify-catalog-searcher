import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Artist } from '../../../models/artist.model';
import { SpotifyService } from '../../../services/spotify.service';

@Component({
  selector: 'app-artist-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css'],
})
export class ArtistPage implements OnInit {
  artistId: string = '';
  artist: Artist | undefined;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit() {
    // Subscribe to route parameters to get the artistId from the URL
    this.route.paramMap.subscribe((params) => {
      this.artistId = params.get('id') || '';
      if (this.artistId) {
        this.fetchArtist();
      }
    });
  }

  fetchArtist() {
    this.spotifyService.getArtist(this.artistId).subscribe(
      (artist) => {
        this.artist = artist;
      },
      (error) => {
        console.error('Error fetching artist:', error);
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
