import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-seller-orders',
  standalone: false,
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.scss'
})

export class SellerOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getSellerOrders().subscribe({
      next: (res) => this.orders = res,
      error: (err) => console.error('Siparişler alınamadı:', err)
    });
  }


  getTotal(order: any) : number {
    return order.items?.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.product.price;
    }, 0);
  }


}
