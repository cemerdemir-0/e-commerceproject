export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  rating: number;
  reviewCount: number;
  sellerEmail?: string;

}
