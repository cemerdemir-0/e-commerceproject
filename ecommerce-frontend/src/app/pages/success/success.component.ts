import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-success',
  standalone: false,
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent implements OnInit {

  constructor(private http:HttpClient) {}


  ngOnInit(): void {
    const token = localStorage.getItem("token");
    const address = localStorage.getItem("lastAddress");

    if (!token || !address) return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8080/api/orders/confirm', address, { headers })
      .subscribe({
        next: () => {
          console.log("✔ Sipariş başarıyla kaydedildi.");
          localStorage.removeItem("lastAddress");
        },
        error: err => {
          console.error("❌ Sipariş kaydedilemedi:", err);
        }
      });
  }


}
