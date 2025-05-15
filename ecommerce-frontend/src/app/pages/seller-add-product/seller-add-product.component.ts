import { Component } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  standalone: false,
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.scss'
})
export class SellerAddProductComponent {
  product = {
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: ''
  };

  constructor(private productService: ProductService, private router: Router) {}

  addProduct() {
    this.productService.addProductAsSeller(this.product).subscribe({
      next: () => {
        alert('Ürün başarıyla eklendi ✅');
        this.router.navigate(['/seller/add-product']); //
      },
      error: (err) => {
        console.error('Ürün eklenemedi:', err);
        alert('Ürün eklenemedi!');
      }
    });
  }

}
