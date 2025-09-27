import { Component, signal } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('DoConnect-Frontend');
   constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
