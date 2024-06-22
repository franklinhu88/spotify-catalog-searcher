import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, map } from 'rxjs';
import { Track } from '../models/track.model';
import { Artist } from '../models/artist.model';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private clientId = 'eecd9a3eea024ecebf85f20d2b605da0';
  private clientSecret = '1f2dd3303b6746f9aac2bd228e0fc0b9';
  public accessToken: string = '';
  private apiUrl = `https://accounts.spotify.com/api/`;

  constructor(private http: HttpClient) {}

  async getAccessToken(): Promise<string> {
    if (this.accessToken != '') {
      return this.accessToken;
    }

    const url = `${this.apiUrl}token`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
    });

    const params = new HttpParams().append('grant_type', 'client_credentials');
    const response: any = await this.http
      .post(url, params.toString(), { headers })
      .toPromise();
    this.accessToken = response.access_token;
    return this.accessToken;
  }

  public getTrack(trackId: string): Observable<Track> {
    const url = `${this.apiUrl}v1/tracks/${trackId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get<Track>(url, { headers });
  }

  getArtist(artistId: string): Observable<Artist> {
    const url = `${this.apiUrl}v1/artists/${artistId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get<Artist>(url, {
      headers,
    });
  }

  public searchTracks(query: string, limit: number = 10): Observable<Track[]> {
    const url = `https://api.spotify.com/v1/search`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track')
      .set('limit', limit.toString());

    return this.http.get<any>(url, { headers, params }).pipe(
      map((response) => {
        const items = response.tracks?.items || [];
        return items.map((item: any) => {
          return {
            album: item.album.href,
            artists: item.artists.map((artist: any) => artist.href),
            explicit: item.explicit,
            id: item.id,
            name: item.name,
            popularity: item.popularity,
          } as Track;
        });
      })
    );
  }
}
