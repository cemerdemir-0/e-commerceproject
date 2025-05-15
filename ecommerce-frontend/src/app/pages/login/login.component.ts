import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http:HttpClient, private router:Router){}

  login() : void {
    const loginData = {email: this.email, password: this.password};

    this.http.post('http://localhost:8080/api/auth/login', loginData, {responseType: "text"})
      .subscribe({
        next:(token:string) => {
          localStorage.setItem('token', token);
          localStorage.setItem('email', this.email);
          this.router.navigate(['/home']);

        },

        error:(err: any) => {
          this.errorMessage = "Giriş başarısız. Bilgilerinizi kontrol edin.";
          console.log("Hata " ,err)
          alert("Hesap bilgileriniz hatalı ya da hesabınız askıda olabilir.")
        }
      });
  }
}
