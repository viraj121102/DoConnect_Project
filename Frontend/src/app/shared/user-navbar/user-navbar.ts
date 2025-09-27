import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-navbar',
  standalone: false,
  templateUrl: './user-navbar.html',
  styleUrl: './user-navbar.css'
})
export class UserNavbar {
  menuOpen: boolean = false;
  constructor(private router: Router,private auth: AuthService,) {}
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
     this.auth.logout();
    this.router.navigate(['/login']);
  }
}
