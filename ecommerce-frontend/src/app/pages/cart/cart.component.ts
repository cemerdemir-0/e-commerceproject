import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
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

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Sepetinizde ürün bulunmuyor!');
      return;
    }

    this.router.navigate(['/checkout']);
  }
}