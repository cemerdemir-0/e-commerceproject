import { OrderItem} from './order-item.model';

export interface Order {
  id: number;
  userEmail: string;
  address: string;
  createdAt: string;
  items: OrderItem[]; // backend'de @OneToMany ile bağlı!
  status: string;
}
