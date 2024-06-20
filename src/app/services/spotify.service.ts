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
  public accessToken = '';

  constructor(private http: HttpClient) {}

  async getAccessToken(): Promise<string> {
    const url = 'https://accounts.spotify.com/api/token';
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
    const url = `https://api.spotify.com/v1/tracks/${trackId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get<Track>(url, { headers });
  }

  getArtist(artistId: string): Observable<Artist> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get<Artist>(
      `https://api.spotify.com/v1/artists/${artistId}`,
      { headers }
    );
  }
}
