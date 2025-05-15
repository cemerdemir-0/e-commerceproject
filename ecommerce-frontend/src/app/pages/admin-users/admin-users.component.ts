import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface User {
  id: number;
  email: string;
  role: string;
  enabled: boolean;
}

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
  standalone: false
})
export class AdminUsersComponent implements OnInit {

  loggedInEmail: string = 'admin@example.com';

  users: User[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get<User[]>('http://localhost:8080/api/admin/users', { headers })
      .subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
          console.error('Kullanıcılar alınamadı:', err);
        }
      });
  }

  toggleUser(user: User) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    const action = user.enabled ? 'disable' : 'enable';
    this.http.put(`http://localhost:8080/api/admin/users/${action}/${user.email}`, {}, { headers })
      .subscribe({
        next: () => {
          user.enabled = !user.enabled; // Hemen güncelle
          alert(`Kullanıcı ${action === 'disable' ? 'devre dışı bırakıldı' : 'aktifleştirildi'}.`);
        },
        error: (err) => {
          console.error('İşlem başarısız:', err);
          alert('İşlem başarısız oldu.');
        }
      });
  }
}
