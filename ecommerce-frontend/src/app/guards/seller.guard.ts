import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SellerGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'SELLER') {
        return true;
      }
    }

    this.router.navigate(['/login']); // yetkisi yoksa logine yönlendir
    return false;
  }
}
