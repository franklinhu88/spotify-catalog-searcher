// src/app/components/search-bar/search-bar.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class NavBarComponent {
  searchTerm: string = '';

  onSearch() {
    console.log('Search term:', this.searchTerm);
    // You can perform further actions here, such as saving the searchTerm to a service or performing a search operation.
  }
}
