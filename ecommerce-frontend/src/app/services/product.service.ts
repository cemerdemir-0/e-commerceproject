import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Product} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = 'http://localhost:8080/api/products';
  private cartUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productUrl);
  }

  addToCart(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.cartUrl}/add/${productId}`, null, { headers });

  }

  getProductById(id: number) : Observable<Product> {
    return this.http.get<Product>(`${this.productUrl}/${id}`);
  }

  addProductAsSeller(product: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    })
    return this.http.post(`${this.productUrl}/add`, product, { headers });
  }


}
