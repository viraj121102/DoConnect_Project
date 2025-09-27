import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../src/environment/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'dc_token';
  private roleKey = 'dc_role';
  private userKey = 'dc_user';

  constructor(private http: HttpClient, private router: Router) {}

  register(payload: RegisterRequest) {
    return this.http.post(`${environment.apiBase}/api/auth/register`, payload);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiBase}/api/auth/login`, payload);
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    try {
      const decoded: any = jwtDecode(token);
      const role =
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        decoded['role'];
      const username =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        decoded['unique_name'];

      if (role) localStorage.setItem(this.roleKey, role);
      if (username) localStorage.setItem(this.userKey, username);

      console.log('Decoded:', decoded);
    } catch (e) {
      console.warn('Token decode failed', e);
    }
  }

  //  Correct getters
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Fixed logout (clear correct keys)
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }
}
