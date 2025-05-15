import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Order} from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

  getUserOrders(): Observable<Order[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Order[]>('http://localhost:8080/api/orders', { headers });
  }

  updateOrderStatus(orderId: number, newStatus: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`http://localhost:8080/api/admin/orders/${orderId}/status`, { status: newStatus }, { headers });
  }

  cancelOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`http://localhost:8080/api/orders/cancel/${orderId}`, {}, { headers });
  }

  cancelOrderByAdmin(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`})
    return this.http.put(`http://localhost:8080/api/orders/cancel-admin/${orderId}`, {}, {headers});
  }

  getSellerOrders(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`})
    return this.http.get<any[]>(`http://localhost:8080/api/orders/seller-orders`, {headers});
  }


}
