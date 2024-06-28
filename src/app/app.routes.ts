import { Routes } from '@angular/router';
import { HomePage } from './components/views/home-page/home-page.component';
import { ArtistPage } from './components/views/artist-page/artist-page.component';
import { AlbumPage } from './components/views/album-page/album-page.component';
import { TrackPage } from './components/views/track-page/track-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'artist/:id', component: ArtistPage },
  { path: 'album/:id', component: AlbumPage },
  { path: 'track/:id', component: TrackPage },
];
