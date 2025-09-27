import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
  standalone:false
})
export class RegisterComponent {
  username = '';
  password = '';
  msg = '';
  err = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.msg = 'Registered successfully! Please login.';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: e => {
        this.err = e?.error || 'Register failed';
      }
    });
  }
}
