import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {atob} from 'node:buffer';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isDarkMode = false;
  currentLanguage = 'tr';
  searchQuery = '';

  constructor(private router: Router) {
    // Load saved preferences
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.currentLanguage = localStorage.getItem('language') || 'tr';
    this.applyDarkMode();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserEmail(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    return payload.sub || 'Kullanıcı';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.role === 'ADMIN';
    }
    return false;
  }

  isSeller(): boolean {
    const token = localStorage.getItem('token');

    if(token) {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.role === 'SELLER'
    }
    return false;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyDarkMode();
  }

  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'tr' ? 'en' : 'tr';
    localStorage.setItem('language', this.currentLanguage);
    // Here you would typically integrate with Angular i18n
    console.log('Language changed to:', this.currentLanguage);
  }

  private applyDarkMode(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      // Ana sayfaya git ve arama parametresi ile
      this.router.navigate(['/home'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    }
  }
}
