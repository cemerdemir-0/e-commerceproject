import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://localhost:8080/api/auth/register', {
      email: this.email,
      password: this.password
    }).subscribe(() => {
      alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
      this.router.navigate(['/login']);
    });
  }
}
