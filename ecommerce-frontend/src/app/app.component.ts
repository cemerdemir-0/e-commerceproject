import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ecommerce-frontend';

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

}
