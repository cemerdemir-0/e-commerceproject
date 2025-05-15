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

  constructor(private router: Router) {}

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


}
