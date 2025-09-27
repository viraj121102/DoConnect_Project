import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] ,
  standalone:false
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: res => {
        this.auth.saveToken(res.token);
        const role = this.auth.getRole();
        if (role && role.toLowerCase() === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/questions']);
        }
      },
      error: err => {
        console.error(err);
        this.error = err?.error || 'Login failed';
      }
    });
  }
}
