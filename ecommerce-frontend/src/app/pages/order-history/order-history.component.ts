import { Component , OnInit} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {Order} from '../../models/order.model';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit {
  orders : Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }


  getTotal(order: any): number {
    return order.items?.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.product.price;
    }, 0);
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe(() => {
      this.loadOrders()// Güncel listeyi tekrar çek
    });

    alert("Sipariş iptal edildi!")
  }

  loadOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: (res) => {
        console.log('Kullanıcı siparişleri : ', res)
        this.orders = res;
      },
      error: (err) => {
        console.error("Siparişler alınamadı:", err);
      }
    });
  }



}

