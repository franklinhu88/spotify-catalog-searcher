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
import { Album } from '../models/album.model';
import { INSPECT_MAX_BYTES } from 'buffer';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private clientId = 'eecd9a3eea024ecebf85f20d2b605da0';
  private clientSecret = '1f2dd3303b6746f9aac2bd228e0fc0b9';
  public accessToken: string = '';
  private accountUrl = `https://accounts.spotify.com/api/`;
  private apiUrl = `https://api.spotify.com/`;

  constructor(private http: HttpClient) {}

  async getAccessToken(): Promise<string> {
    if (this.accessToken != '') {
      return this.accessToken;
    }

    const url = `${this.accountUrl}token`;
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

    return this.http.get<any>(url, { headers }).pipe(
      map((item) => {
        return {
          album: item.album.id,
          artists: item.artists.map((artist: any) => artist.id),
          explicit: item.explicit,
          id: item.id,
          name: item.name,
          popularity: item.popularity,
        } as Track;
      })
    );
  }

  public getAlbum(albumId: string): Observable<Album> {
    const url = `${this.apiUrl}v1/albums/${albumId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get<any>(url, { headers }).pipe(
      map((item) => {
        return {
          id: item.id,
          imageURL: item.images[0].url ?? '',
          name: item.name,
          artists: item.artists.map((artist: any) => artist.id),
          tracks: item.tracks.items.map((track: any) => track.id),
          popularity: item.popularity,
        } as Album;
      })
    );
  }

  public getArtist(artistID: string): Observable<Artist> {
    const url = `${this.apiUrl}v1/artists/${artistID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get<any>(url, { headers }).pipe(
      map((item) => {
        return {
          id: item.id,
          imageUrl: item.images[0]?.url ?? '',
          name: item.name,
          followerCount: item.followers.total,
          href: item.href,
          popularity: item.popularity,
        } as Artist;
      })
    );
  }

  public search(
    query: string,
    type: string,
    limit: number = 10
  ): Observable<Track[] | Album[] | Artist[]> {
    const url = `${this.apiUrl}v1/search`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    const params = new HttpParams()
      .set('q', `${type}:${query}`)
      .set('type', type)
      .set('limit', limit.toString());

    return this.http.get<any>(url, { headers, params }).pipe(
      map((response) => {
        if (type === 'track') {
          const items = response.tracks?.items || [];
          return items.map((item: any) => {
            return {
              album: item.album.id,
              artists: item.artists.map((artist: any) => artist.id),
              explicit: item.explicit,
              id: item.id,
              name: item.name,
              popularity: item.popularity,
            } as Track;
          });
        } else if (type === 'album') {
          const items = response.albums?.items || [];
          return items
            .filter((item: any) => item.album_type === 'album')
            .map((item: any) => {
              return {
                id: item.id,
                imageURL: item.images[0].url ?? '',
                name: item.name,
                artists: item.artists.map((artist: any) => artist.id),
                tracks: item.tracks?.items.map((track: any) => track.id) || [],
              } as Album;
            });
        } else if (type === 'artist') {
          const items = response.artists?.items || [];
          return items.map((item: any) => {
            return {
              id: item.id,
              imageUrl: item.images[0]?.url ?? '',
              name: item.name,
              followerCount: item.followers.total,
              href: item.href,
              popularity: item.popularity,
            } as Artist;
          });
        }
      })
    );
  }
}
