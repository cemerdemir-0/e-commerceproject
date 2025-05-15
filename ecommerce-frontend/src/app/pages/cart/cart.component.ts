import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CartItem} from '../../models/cart-item.model';
import {CartService} from '../../services/cart.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {response} from 'express';

declare var Stripe: any;

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent implements OnInit {
  cartItems: any[] = [];

  addressForm!: FormGroup;  // FormGroup tanımı

  constructor(private cartService: CartService, private http:HttpClient, private fb:FormBuilder) {}

  ngOnInit(): void {
    this.loadCart();

    this.addressForm=this.fb.group({
      address: ['', [Validators.required, Validators.minLength(10)]]
    })

  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
      },
      error: (err) => {
        console.error('Sepet yüklenemedi:', err);
      },
    });
  }

  increase(productId: number): void {
    this.cartService.increaseQuantity(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Arttırma hatası:', err),
    });
  }

  decrease(productId: number): void {
    this.cartService.decreaseQuantity(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Azaltma hatası:', err),
    });
  }

  remove(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Silme hatası:', err),
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }


  /* checkout(): void {
    if (this.addressForm.invalid) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });

    const address = this.addressForm.get('address')?.value;

    this.http.post('http://localhost:8080/api/orders/checkout', address, { headers })
      .subscribe({
        next: () => {
          alert("✅ Sipariş başarıyla oluşturuldu!");
          this.cartItems = [];
          this.addressForm.reset();
        },
        error: err => {
          console.error(err);
          alert("❌ Sipariş oluşturulamadı: " + err.error);
        }
      });
  }

   */

  checkout(): void {
    const stripe = Stripe('pk_test_51RFHuQQ0uIa0RRV3fPb3DfkMH4ss3x0CMwtvhSepFaIkVQh6jLbWr3rRoVztv07d3iTsYqVmwwdqjLfYcf56b1g500xkfHp70q'); // Buraya kendi public key’ini yaz

    const address = this.addressForm.get('address')?.value;
    localStorage.setItem("lastAddress", address);


    this.cartService.createCheckoutSession(this.cartItems).subscribe({
      next: (res: any) => {
        console.log("Stripe yanıtı:", res);

        if (!res.sessionId) {
          alert("⚠️ Stripe oturumu başlatılamadı.");
          return;
        }

        stripe.redirectToCheckout({ sessionId: res.sessionId });
      },
      error: err => {
        console.error("Stripe hatası:", err);
        alert("❌ Ödeme işlemi başlatılamadı.");
      }
    });
  }

}
