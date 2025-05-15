import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartUrl = 'http://localhost:8080/api/cart'

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.cartUrl}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  removeFromCart(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.cartUrl}/remove/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  increaseQuantity(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.cartUrl}/increase/${productId}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  decreaseQuantity(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.cartUrl}/decrease/${productId}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  createCheckoutSession(items: any[]) {
    const token = localStorage.getItem('token');
    return this.http.post<{ sessionId: string }>('http://localhost:8080/api/payment/create-checkout-session', items, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }



}
