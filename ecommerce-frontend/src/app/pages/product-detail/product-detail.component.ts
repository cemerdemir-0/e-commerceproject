import {Component, OnInit} from '@angular/core';
import {Product} from '../../models/product.model';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {ReviewService} from '../../services/review.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

  reviews: any[] = [];
  rating: number = 5;
  comment: string = '';


  product!: Product;

  constructor(private route: ActivatedRoute, private productService: ProductService, private reviewService: ReviewService) {
  }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (productId) {
      // Ürünü getir
      this.productService.getProductById(productId).subscribe({
        next: (data) => this.product = data,
        error: (err) => console.error('Ürün bulunamadı:', err),
      });

      // Yorumları getir
      this.reviewService.getReviews(productId).subscribe({
        next: (data) => this.reviews = data,
        error: (err) => console.error('Yorumlar alınamadı:', err),
      });
    }
  }


  addToCart(productId: number): void {
    this.productService.addToCart(productId).subscribe({
      next: (res) => alert(res.message + ' 🛒'),
      error: (err) => console.error(err),
    });
  }

  submitReview(): void {
    if (!this.comment.trim()) {
      alert('Yorum boş olamaz.');
      return;
    }

    const productId = this.product.id;
    this.reviewService.addReview(productId, {
      rating: this.rating,
      comment: this.comment
    }).subscribe({
      next: () => {
        alert('Yorum gönderildi!');
        this.comment = '';
        this.rating = 5;
        this.ngOnInit(); // Yorum listesini güncelle
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || 'Yorum gönderilemedi.');
      }
    });
  }

}
