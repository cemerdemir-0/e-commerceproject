import { Component } from '@angular/core';
import {ChartOptions, ChartType, ChartData} from 'chart.js';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-admin-sales',
  standalone: false,
  templateUrl: './admin-sales.component.html',
  styleUrl: './admin-sales.component.scss'
})
export class AdminSalesComponent {
  orders: any[] = [];

  // Grafik için:
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { label: 'Aylık Satışlar', data: [] }
    ]
  };
  barChartOptions: ChartOptions = {
    responsive: true
  };
  barChartType: ChartType = 'bar';

  constructor(private http: HttpClient, private orderService:OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get<any[]>('http://localhost:8080/api/admin/orders', { headers })
      .subscribe(data => {
        this.orders = data;
        this.prepareChartData();
      });
  }

  prepareChartData() {
    // Basit bir aylık sipariş sayısını grafiğe dökmek
    const monthlySales: { [key: string]: number } = {};

    for (const order of this.orders) {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString('default', { month: 'long' }); // Örn: "April"
      if (!monthlySales[month]) {
        monthlySales[month] = 1;
      } else {
        monthlySales[month]++;
      }
    }

    this.barChartLabels = Object.keys(monthlySales);
    this.barChartData = {
      labels: Object.keys(monthlySales),
      datasets: [
        {
          label: 'Aylık Sipariş Adedi',
          data: Object.values(monthlySales)
        }
      ]
    };
  }

  getTotal(order: any): number {
    return order.items?.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.product.price;
    }, 0);
  }

  updateStatus(orderId: number, newStatus: string): void {
    console.log('Güncellenen ID:', orderId, 'Yeni Durum:', newStatus);
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe(() => {
      alert("İşlem başarılı.");
      this.loadOrders(); // güncel veriyi çek
    });
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancelOrderByAdmin(orderId).subscribe(() => {
      this.loadOrders();
    })

    alert("Sipariş admin tarafından iptal edildi.");
  }


}
