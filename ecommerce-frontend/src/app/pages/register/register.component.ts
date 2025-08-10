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

  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  password = '';
  showPassword = false;
  acceptTerms = false;
  acceptMarketing = false;

  constructor(private http: HttpClient, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(): number {
    const password = this.password;
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    return strength;
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength === 0) return '';
    if (strength <= 25) return 'Zayıf';
    if (strength <= 50) return 'Orta';
    if (strength <= 75) return 'İyi';
    return 'Güçlü';
  }

  register() {
    if (!this.acceptTerms) {
      alert('Kullanım şartlarını kabul etmelisiniz.');
      return;
    }

    const registerData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      acceptMarketing: this.acceptMarketing
    };

    this.http.post('http://localhost:8080/api/auth/register', registerData).subscribe({
      next: () => {
        alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Kayıt hatası:', err);
        alert('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    });
  }
}
