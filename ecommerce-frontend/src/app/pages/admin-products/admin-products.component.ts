import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit{

  productForm!: FormGroup;
  products: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}


  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, Validators.required],
      category: ['', Validators.required],
      imageUrl: ['https://via.placeholder.com/150']
    });

    this.loadProducts(); // Mevcut ürünleri çek
  }

  loadProducts(): void {
    this.http.get<any[]>('http://localhost:8080/api/products')
      .subscribe(data => this.products = data);
  }

  submitProduct(): void {
    const headers = new HttpHeaders({

      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.post('http://localhost:8080/api/admin/products', this.productForm.value, { headers })
      .subscribe(() => {
        alert('Ürün eklendi!');
        this.productForm.reset();
        this.loadProducts(); // Listeyi yenile
      });
  }

  updateProduct(product: any): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.put(`http://localhost:8080/api/admin/products/${product.id}`, product, { headers })
      .subscribe(() => alert('Güncellendi!'));
  }

  deleteProduct(id: number): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.delete(`http://localhost:8080/api/admin/products/${id}`, { headers })
      .subscribe(() => {
        alert('Silindi!');
        this.loadProducts();
      });
  }

}
