import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];


  searchText: string = '';
  selectedCategory : string = '';


  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data

        // Kategorileri otomatik olarak çıkar
        const allCategories = this.products.map(p => p.category);
        this.categories = [...new Set(allCategories)];
      },

      error: (err) => {
        console.error('Ürünler alınamadı:', err);
      }

    })
  }

  addToCart(productId: number): void {
    this.productService.addToCart(productId).subscribe({
      next: (res:any) => alert(res.message + ' 🛒'),
      error: (err) => console.log(err),
    });
  }

  filteredProducts(): Product[] {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
      (this.selectedCategory === '' || product.category === this.selectedCategory)
    );
  }


}
