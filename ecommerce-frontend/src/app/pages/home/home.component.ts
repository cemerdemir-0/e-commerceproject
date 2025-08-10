import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: string[] = [];

  searchText: string = '';
  selectedCategory : string = '';

  // Carousel properties
  currentSlide = 0;
  slides = [
    { title: 'Yaz Sezonu İndirimi', subtitle: 'Kıyafetlerde %50\'ye varan indirimler' },
    { title: 'Teknolojik Ürünler', subtitle: 'Peşin fiyatına 6 taksit imkanı' },
    { title: 'Ev & Yaşam', subtitle: 'Evinizi güzelleştiren ürünler' },
    { title: 'Spor & Outdoor', subtitle: 'Aktif yaşam için her şey' }
  ];
  private slideInterval: any;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

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

    });

    // Handle search query from navbar
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchText = params['search'];
      }
    });

    // Start carousel auto-play
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
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

  // Carousel methods
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.resetCarouselTimer();
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.resetCarouselTimer();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.resetCarouselTimer();
  }

  private startCarousel(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5 saniyede bir otomatik geçiş
  }

  private resetCarouselTimer(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startCarousel();
  }

  onCarouselMouseEnter(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  onCarouselMouseLeave(): void {
    this.startCarousel();
  }
}
