import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class fixGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
